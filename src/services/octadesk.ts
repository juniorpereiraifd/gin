type OctadeskCustomField = {
  id: string;
  value: string;
  domainType: number;
};

type OctadeskChatUser = {
  name: string;
  thirdPartyId: string;
  email: string;
  phoneNumber?: string;
  customFields: OctadeskCustomField[];
};

export type OctadeskChat = {
  login?: (user: OctadeskChatUser) => void;
  isReady?: () => boolean;
  clearSession?: () => void;
  clearStorage?: () => void;
  show?: () => void;
  hide?: () => void;
  showApp?: () => void;
  hideApp?: () => void;
  showButton?: () => void;
  hideButton?: () => void;
  toggle?: () => void;
  closeConversation?: () => void;
};

export type OctadeskChatOptions = {
  subDomain: string;
  showButton: string;
  openOnMessage: string;
  showFooterPoweredBy: string;
  hide: string;
  login?: OctadeskChatUser;
};

export type Octadesk = {
  chat?: OctadeskChat;
  chatOptions?: OctadeskChatOptions;
};

export type OctadeskIdentity = {
  name: string;
  login: string;
  email: string;
  phoneNumber: string;
  thirdPartyId: string;
  unitId: string;
  unitName: string;
};

const EMBED_SCRIPT_URL = 'https://cdn.octadesk.com/embed.js';

const CHAT_OPTIONS = {
  showButton: 'false',
  openOnMessage: 'true',
  showFooterPoweredBy: 'true',
  hide: 'true',
};

const CUSTOM_FIELD_DOMAIN_TYPE = 2;

const CUSTOM_FIELD_IDS = {
  client: 'cliente',
  login: 'login_get_in',
  hashId: 'hash_id',
};

const READY_EVENT_NAMES = ['onOctaChatReady', 'on0ctaChatReady'];
const READY_TIMEOUT_IN_MS = 60000;
const READY_POLL_INTERVAL_IN_MS = 300;

const APP_ELEMENT_SELECTOR = 'div[id^="octadesk-octachat-app"]';
const APP_HIDDEN_CLASS = 'octadesk-octachat-app-hide';
const APP_OPEN_CLASS = 'octachatAppOpen';
const APP_CLOSED_CLASS = 'octachatAppClose';

const OPEN_ENFORCEMENT_DURATION_IN_MS = 5000;
const MAX_SHOW_APP_ATTEMPTS = 3;
const SHOW_APP_RETRY_INTERVAL_IN_MS = 400;

const IDENTITY_DEBOUNCE_IN_MS = 500;

const SESSION_STORAGE_KEY_PREFIX = 'octa_chat_';
const IDENTITY_VERSION_STORAGE_KEY = 'octadesk:identity-version';
const IDENTITY_VERSION = 'v1-email-fallback';

let readyPromise: Promise<void> | null = null;
let lastIdentitySignature: string | null = null;
let pendingIdentity: OctadeskIdentity | null = null;
let identityTimeout: number | null = null;

let appObserver: MutationObserver | null = null;
let isOpenRequested = false;
let hasObservedAppOpen = false;
let showAppAttempts = 0;
let lastShowAppRequestAt = 0;
let openEnforcementTimeout: number | null = null;

const getChat = (): OctadeskChat | undefined => window.octadesk?.chat;

const runQuietly = (action: () => void) => {
  try {
    action();
  } catch {
    return;
  }
};

const isChatReady = () => {
  const chat = getChat();

  if (chat === undefined || typeof chat.login !== 'function') {
    return false;
  }

  try {
    return typeof chat.isReady === 'function' ? chat.isReady() : true;
  } catch {
    return false;
  }
};

const buildCustomFields = (identity: OctadeskIdentity): OctadeskCustomField[] =>
  [
    { id: CUSTOM_FIELD_IDS.client, value: identity.unitName },
    { id: CUSTOM_FIELD_IDS.login, value: identity.login },
    { id: CUSTOM_FIELD_IDS.hashId, value: identity.unitId },
  ]
    .filter((field) => field.value !== '')
    .map((field) => ({ ...field, domainType: CUSTOM_FIELD_DOMAIN_TYPE }));

const warnWhenEmailIsMissing = (identity: OctadeskIdentity) => {
  if (identity.email !== '' || import.meta.env.DEV === false) {
    return;
  }

  console.warn(
    'Octadesk: usuário sem e-mail e sem username (auth.user.email/auth.user.username), ' +
      'não foi possível gerar nem o e-mail de fallback. A identificação automática ' +
      `vai falhar e o formulário de pré-atendimento será exibido. Login recebido: "${identity.login}".`
  );
};

const buildChatUser = (identity: OctadeskIdentity): OctadeskChatUser => {
  warnWhenEmailIsMissing(identity);

  return {
    name: identity.name,
    thirdPartyId: identity.thirdPartyId,
    email: identity.email,
    ...(identity.phoneNumber !== '' && { phoneNumber: identity.phoneNumber }),
    customFields: buildCustomFields(identity),
  };
};

const buildIdentitySignature = (identity: OctadeskIdentity) =>
  [
    identity.thirdPartyId,
    identity.name,
    identity.login,
    identity.email,
    identity.phoneNumber,
    identity.unitId,
    identity.unitName,
  ].join('|');

const getAppElement = () =>
  document.querySelector<HTMLElement>(APP_ELEMENT_SELECTOR);

const hasAppClass = (appElement: HTMLElement, className: string) =>
  appElement.classList.contains(className);

const removeAppClass = (appElement: HTMLElement, className: string) => {
  if (!hasAppClass(appElement, className)) {
    return;
  }

  runQuietly(() => appElement.classList.remove(className));
};

export const isOctadeskChatOpen = () => {
  const appElement = getAppElement();

  return (
    appElement !== null &&
    hasAppClass(appElement, APP_OPEN_CLASS) &&
    !hasAppClass(appElement, APP_HIDDEN_CLASS)
  );
};

const clearStoredChatSession = () =>
  runQuietly(() => {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(SESSION_STORAGE_KEY_PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
  });

const migrateStoredChatSession = () => {
  let storedVersion: string | null = null;

  try {
    storedVersion = window.localStorage.getItem(IDENTITY_VERSION_STORAGE_KEY);
  } catch {
    return;
  }

  if (storedVersion === IDENTITY_VERSION) {
    return;
  }

  clearStoredChatSession();
  runQuietly(() =>
    window.localStorage.setItem(IDENTITY_VERSION_STORAGE_KEY, IDENTITY_VERSION)
  );
};

const injectEmbedScript = () =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_URL}"]`) !== null) {
      resolve();
      return;
    }

    const script = document.createElement('script');

    script.async = true;
    script.src = EMBED_SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Não foi possível carregar o widget do Octadesk.'));

    document.body.appendChild(script);
  });

const waitUntilChatIsReady = () =>
  new Promise<void>((resolve, reject) => {
    if (isChatReady()) {
      resolve();
      return;
    }

    const startedAt = Date.now();

    const onReadyEvent = () => {
      if (isChatReady()) {
        finish(resolve);
      }
    };

    const finish = (settle: () => void) => {
      window.clearInterval(interval);
      READY_EVENT_NAMES.forEach((eventName) => window.removeEventListener(eventName, onReadyEvent));
      settle();
    };

    const interval = window.setInterval(() => {
      if (isChatReady()) {
        finish(resolve);
        return;
      }

      if (Date.now() - startedAt > READY_TIMEOUT_IN_MS) {
        finish(() => reject(new Error('O widget do Octadesk não ficou disponível.')));
      }
    }, READY_POLL_INTERVAL_IN_MS);

    READY_EVENT_NAMES.forEach((eventName) => window.addEventListener(eventName, onReadyEvent));
  });

const requestShowApp = (appElement: HTMLElement) => {
  const chat = getChat();

  if (chat === undefined) {
    return;
  }

  showAppAttempts += 1;
  lastShowAppRequestAt = Date.now();

  removeAppClass(appElement, APP_CLOSED_CLASS);
  removeAppClass(appElement, APP_HIDDEN_CLASS);
  runQuietly(() => chat.show?.());

  if (typeof chat.showApp === 'function') {
    runQuietly(() => chat.showApp?.());
    return;
  }

  runQuietly(() => chat.toggle?.());
};

const stopOpenEnforcement = () => {
  isOpenRequested = false;
  hasObservedAppOpen = false;
  showAppAttempts = 0;

  if (openEnforcementTimeout !== null) {
    window.clearTimeout(openEnforcementTimeout);
    openEnforcementTimeout = null;
  }

  flushPendingIdentity();
};

const enforceOpenState = (appElement: HTMLElement) => {
  const isAppOpen = hasAppClass(appElement, APP_OPEN_CLASS);
  const isAppClosed = hasAppClass(appElement, APP_CLOSED_CLASS);

  if (isAppOpen) {
    hasObservedAppOpen = true;
  }

  if (isAppClosed && hasObservedAppOpen) {
    stopOpenEnforcement();
    return;
  }

  removeAppClass(appElement, APP_HIDDEN_CLASS);

  const hasWaitedForResponse =
    Date.now() - lastShowAppRequestAt > SHOW_APP_RETRY_INTERVAL_IN_MS;

  if (isAppClosed && hasWaitedForResponse && showAppAttempts < MAX_SHOW_APP_ATTEMPTS) {
    requestShowApp(appElement);
  }
};

const handleAppClassChange = () => {
  const appElement = getAppElement();

  if (appElement === null) {
    return;
  }

  if (isOpenRequested) {
    enforceOpenState(appElement);
  }

  flushPendingIdentity();
};

const observeAppElement = () => {
  if (appObserver !== null) {
    return;
  }

  const appElement = getAppElement();

  if (appElement === null) {
    return;
  }

  appObserver = new MutationObserver(handleAppClassChange);
  appObserver.observe(appElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
};

const flushPendingIdentity = () => {
  if (pendingIdentity === null || identityTimeout !== null) {
    return;
  }

  if (isOpenRequested || isOctadeskChatOpen()) {
    return;
  }

  const chat = getChat();

  if (typeof chat?.login !== 'function') {
    console.warn('Octadesk: chat.login indisponível, identidade do usuário não foi atualizada.');
    return;
  }

  const identity = pendingIdentity;

  pendingIdentity = null;
  lastIdentitySignature = buildIdentitySignature(identity);

  try {
    chat.login(buildChatUser(identity));
  } catch {
    lastIdentitySignature = null;
  }
};

const scheduleIdentityFlush = () => {
  if (identityTimeout !== null) {
    window.clearTimeout(identityTimeout);
  }

  identityTimeout = window.setTimeout(() => {
    identityTimeout = null;
    flushPendingIdentity();
  }, IDENTITY_DEBOUNCE_IN_MS);
};

export const loadOctadeskChat = (subDomain: string, identity: OctadeskIdentity): Promise<void> => {
  if (readyPromise !== null) {
    return readyPromise;
  }

  if (subDomain === '') {
    return Promise.reject(new Error('Subdomínio do Octadesk não configurado.'));
  }

  migrateStoredChatSession();

  window.octadesk = window.octadesk || {};
  window.octadesk.chatOptions = {
    ...CHAT_OPTIONS,
    subDomain,
    login: buildChatUser(identity),
  };

  lastIdentitySignature = buildIdentitySignature(identity);

  readyPromise = injectEmbedScript()
    .then(waitUntilChatIsReady)
    .then(observeAppElement)
    .catch((error) => {
      readyPromise = null;
      throw error;
    });

  return readyPromise;
};

export const identifyOctadeskUser = (identity: OctadeskIdentity) => {
  if (buildIdentitySignature(identity) === lastIdentitySignature) {
    return;
  }

  pendingIdentity = identity;

  scheduleIdentityFlush();
};

export const logoutOctadeskChat = () => {
  lastIdentitySignature = null;
  pendingIdentity = null;

  if (identityTimeout !== null) {
    window.clearTimeout(identityTimeout);
    identityTimeout = null;
  }

  stopOpenEnforcement();

  const chat = getChat();

  runQuietly(() => chat?.clearSession?.());
  runQuietly(() => chat?.clearStorage?.());
};

const openChat = () => {
  const appElement = getAppElement();

  if (getChat() === undefined || appElement === null) {
    return;
  }

  observeAppElement();

  isOpenRequested = true;
  hasObservedAppOpen = hasAppClass(appElement, APP_OPEN_CLASS);
  showAppAttempts = 0;

  if (openEnforcementTimeout !== null) {
    window.clearTimeout(openEnforcementTimeout);
  }

  openEnforcementTimeout = window.setTimeout(stopOpenEnforcement, OPEN_ENFORCEMENT_DURATION_IN_MS);

  if (hasObservedAppOpen) {
    removeAppClass(appElement, APP_HIDDEN_CLASS);
    runQuietly(() => getChat()?.show?.());
    return;
  }

  requestShowApp(appElement);
};

export const openOctadeskChat = () => {
  if (!isChatReady() && readyPromise !== null) {
    readyPromise.then(openChat).catch(() => undefined);
    return;
  }

  openChat();
};

export const closeOctadeskChat = () => {
  const chat = getChat();

  if (chat === undefined) {
    return;
  }

  stopOpenEnforcement();

  runQuietly(() => chat.hide?.());

  flushPendingIdentity();
};

export const toggleOctadeskChat = () => {
  if (isOctadeskChatOpen()) {
    closeOctadeskChat();
    return;
  }

  openOctadeskChat();
};

import type { OctadeskIdentity } from 'src/services/octadesk';
import type { UserProps } from './reducer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FALLBACK_EMAIL_DOMAIN = 'emailgetinoctadesk.com';
const INVALID_LOCAL_PART_CHARS = /[^a-z0-9._+-]/g;

const NON_DIGIT_CHARS = /\D/g;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 13;

export type OctadeskUnitContext = {
  id: string;
  name: string;
};

export const isEmail = (value: unknown): value is string =>
  typeof value === 'string' && EMAIL_PATTERN.test(value.trim());

export const resolveUserLogin = (user: UserProps | null): string => {
  const email = [user?.email, user?.username].find(isEmail);

  if (email !== undefined) {
    return email.trim().toLowerCase();
  }

  return user?.username?.trim() || user?.email?.trim() || '';
};

export const buildFallbackEmail = (login: string): string => {
  const localPart = login
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(INVALID_LOCAL_PART_CHARS, '')
    .replace(/^\.+|\.+$/g, '');

  return localPart === '' ? '' : `${localPart}@${FALLBACK_EMAIL_DOMAIN}`;
};

export const resolveUserEmail = (user: UserProps | null): string => {
  const login = resolveUserLogin(user);

  return isEmail(login) ? login : buildFallbackEmail(login);
};

export const resolveUserPhoneNumber = (user: UserProps | null): string => {
  const digits = (user?.telephone ?? '').replace(NON_DIGIT_CHARS, '');
  const hasPlausibleLength =
    digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS;

  return hasPlausibleLength ? digits : '';
};

export const buildOctadeskIdentity = (
  user: UserProps | null,
  unit: OctadeskUnitContext
): OctadeskIdentity => {
  const email = resolveUserEmail(user);
  const login = resolveUserLogin(user);

  return {
    name: user?.name?.trim() || login,
    login,
    email,
    phoneNumber: resolveUserPhoneNumber(user),
    thirdPartyId: String(user?.id ?? ''),
    unitId: unit.id,
    unitName: unit.name,
  };
};

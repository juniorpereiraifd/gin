import { notification as notify, Select } from 'antd';
import { AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { UserProps } from 'src/store/modules/auth/reducer';
import { theme } from 'src/styles/theme';
import uuid from 'uniqid';
import { DATE_FORMAT_OPTIONS, DEVICES, REGULAR_EXPRESSIONS } from './constants';
import dayjs from 'dayjs';
import type { ArgsProps } from 'antd/es/notification';

let id = uuid();

type EventProps = {
  [key: string]: unknown;
};

type ErrorProps = {
  [key: string]: Array<string>;
};

const { Option } = Select;

export async function updateToken(callback: () => Promise<AxiosResponse<any, any>>) {
  const token = localStorage.getItem('access_token');

  if (token) {
    const decodedHeader = jwt_decode<{
      alg: string;
      typ: string;
      version?: string;
    }>(token, {
      header: true,
    });

    if ('version' in decodedHeader) {
      return null;
    } else {
      return callback();
    }
  } else {
    return;
  }
}

export const formatErrors = (errors: ErrorProps) =>
  Object.keys(errors).map((key) => ({
    name: key,
    errors: errors[key],
  }));

export const getCurrency = (value: number) => value / 100;

export const getCurrencyBrl = (value: number, withoutCents?: boolean) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: withoutCents === undefined ? 2 : 0,
  }).format(value);
};

export const generateItemsToLoading = (quantity: number) =>
  new Array(quantity).fill(undefined).map((_, index) => ({
    key: index,
  }));

export function isAuthenticated(user: UserProps | null) {
  if (user === null || (localStorage.getItem('access_token') || null) === null) {
    return false;
  }

  return true;
}

const size = window.screen.width > 2000 ? 393 : 328;

type OptionProps = {
  duration?: number;
  placement?: ArgsProps['placement'];
};

export const notification = {
  warning: (title: string, description: string | React.ReactNode, options?: OptionProps) =>
    notify.open({
      placement: 'bottomRight',
      message: <b>{title}</b>,
      description: description,
      top: 80,
      style: {
        width: size,
        border: `1px solid ${theme.colors.darkWarning}`,
        borderRadius: '8px',
        marginRight: -7,
        backgroundColor: theme.colors.warning,
      },
      ...options,
    }),
  success: (title: string, description: string | React.ReactNode, options?: OptionProps) =>
    notify.open({
      placement: 'bottomRight',
      message: <b>{title}</b>,
      description: description,
      top: 80,
      style: {
        width: size,
        border: `1px solid ${theme.colors.darkSuccess}`,
        borderRadius: '8px',
        marginRight: -7,
        backgroundColor: theme.colors.success,
      },
      ...options,
    }),
  error: (title: string, description: string | React.ReactNode, options?: OptionProps) =>
    notify.open({
      placement: 'bottomRight',
      message: <b>{title}</b>,
      description: description,
      top: 80,
      style: {
        width: size,
        border: `1px solid ${theme.colors.darkDanger}`,
        borderRadius: '8px',
        marginRight: -7,
        backgroundColor: theme.colors.danger,
      },
      ...options,
    }),
};

export const Event = {
  push: (name: string, props?: EventProps) => {
    window.dataLayer = window.dataLayer || [];

    if (!id) {
      id = uuid();
    }

    const params = {
      event: name,
      uu_id: id,
      ...props,
    };

    window.dataLayer.push(params);
  },
};

export const getDeviceType = () => {
  const { userAgent } = navigator;
  const { Macintosh, Windows, Linux, Android, iPhone, iPad, WindowsPhone } = DEVICES;

  const isMacintosh = userAgent.includes(Macintosh);
  if (isMacintosh) return Macintosh;

  const isWindows = userAgent.includes(Windows);
  if (isWindows) return Windows;

  const isLinux = userAgent.includes(Linux) && !userAgent.includes(Android);
  if (isLinux) return Linux;

  const isAndroid = userAgent.includes(Linux) && userAgent.includes(Android);
  if (isAndroid) return Android;

  const isIPhone = userAgent.includes(iPhone);
  if (isIPhone) return iPhone;

  const isPad = userAgent.includes(iPad);
  if (isPad) return iPad;

  const isWindowsPhone = userAgent.includes(WindowsPhone);
  if (isWindowsPhone) return WindowsPhone;

  return 'unknown';
};

export function validateCnpj(s: string) {
  const cnpj = s.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  const t = cnpj.length - 2,
    d = cnpj.substring(t),
    d1 = parseInt(d.charAt(0)),
    d2 = parseInt(d.charAt(1)),
    calc = (x: number) => {
      const n = cnpj.substring(0, x);
      let y = x - 7;
      let s = 0;
      let r = 0;

      for (let i = x; i >= 1; i--) {
        s += +n.charAt(x - i) * y--;
        if (y < 2) y = 9;
      }

      r = 11 - (s % 11);
      return r > 9 ? 0 : r;
    };

  return calc(t) === d1 && calc(t + 1) === d2;
}

export const getStringIgnoringAccents = (text: string, defaultCase?: boolean) => {
  const updatedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return defaultCase ? updatedText : updatedText.toLowerCase();
};

type GetPercentageOptions = {
  returnType: 'string' | 'number';
};

export const getPercentage = (value: number, total: number, { returnType }: GetPercentageOptions) => {
  if (returnType === 'string') {
    return Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / total);
  }

  const percent = (100 * value) / total;
  return Number(percent.toFixed(1));
};

export const getPhoneNumberUnformatted = (phone: string) => phone.replace(/[\W_]+/g, '');

export const getPhoneNumberWithNationalCode = (phone: string): string => {
  const phoneCleared = getPhoneNumberUnformatted(phone);

  if (phoneCleared === '') {
    return '';
  }

  return `55${phoneCleared}`;
};

export function getPhoneNumberFormatted(phoneNumber: string | number, numberType: 'withCountry' | 'withoutCountry') {
  const phoneCleared = `${String(phoneNumber)}`.replace(/\D/g, '');
  const match = phoneCleared.match(REGULAR_EXPRESSIONS.fullPhoneNumber);

  if (numberType === 'withCountry') {
    return `+${match?.[1]} (${match?.[2]}) ${match?.[3]}-${match?.[4]}`;
  } else {
    return `(${match?.[2]}) ${match?.[3]}-${match?.[4]}`;
  }
}

export const getLinkWithHttpsProtocol = (link: string) => {
  if (link.includes('http') && !link.includes('https')) {
    return link.replace('http', 'https');
  }
  const linkNotHasHttpProtocol = !!link.match(REGULAR_EXPRESSIONS.urlWithoutHttpProtocolRequiredRegExp);
  if (linkNotHasHttpProtocol) return `https://${link}`;
  return link;
};

export const getFormattedDate = (date: string, formatOptions?: Intl.DateTimeFormatOptions) =>
  new Date(date?.replace(REGULAR_EXPRESSIONS.hyphen, '/')).toLocaleString(
    'pt-BR',
    formatOptions || DATE_FORMAT_OPTIONS,
  );

export const getCurrentMonth = () => {
  const monthIndex: number = new Date().getMonth();
  return {
    numberMonth: monthIndex + 1,
    textMonth: getStringMonth(monthIndex + 1),
  } as { numberMonth: number; textMonth: string };
};

export const getStringMonth = (month: number) => {
  const months = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
  };

  return months[month as keyof typeof months];
};

export const renderFriendlyMinuteValue = (timeInMinutes: number) => {
  return timeInMinutes >= 1440
    ? `${timeInMinutes / 1440} dia(s)`
    : timeInMinutes >= 60
      ? `${timeInMinutes / 60} hora(s)`
      : `${timeInMinutes} minutos`;
};

export const renderDynamicallyOptions = (options: Array<number | string>, processText?: (arg: any) => any) => {
  return options.map((key) => {
    return (
      <Option value={key} key={key}>
        {processText ? processText(key) : key}
      </Option>
    );
  });
};

export const moneyFormatter = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatGetInTax = (tax: string | number | undefined) => {
  if (tax === undefined) {
    return 0.1;
  }

  const taxFormatted = typeof tax === 'string' ? parseFloat(tax) : tax;

  return taxFormatted / 100;
};

const getFees = (value: number, tax: string | number | undefined) => {
  let taxValue = value * formatGetInTax(tax);
  let amountReceivable = value - taxValue;

  if (value < 2) {
    taxValue = parseFloat(taxValue.toFixed(3));
    amountReceivable = parseFloat(amountReceivable.toFixed(3));
  }

  return {
    taxValue,
    amountReceivable,
  };
};

type handlePopulatePriceProps = {
  value: number;
  getInTax: string | number | undefined;
  setPrice?: (value: number) => void;
  setFeesGetIn: (value: { taxGetIn: number; amountReceivable: number }) => void;
};

export const handlePopulatePrice = (props: handlePopulatePriceProps) => {
  const { value, getInTax, setPrice, setFeesGetIn } = props;

  const fees = getFees(value, getInTax);

  setPrice?.(value);
  setFeesGetIn({
    taxGetIn: fees.taxValue,
    amountReceivable: fees.amountReceivable,
  });
};

export const getCalculatedDateRange = (value: number) => {
  let today = new Date();

  const subtractedDate = new Date(today);
  subtractedDate.setDate(today.getDate() - value);

  today = new Date();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return {
    today: today,
    yesterday: yesterday,
    selectedDate: subtractedDate,
  };
};

type ConvertCurrencyOptions = {
  type: 'integer' | 'cents';
};

export const convertCurrency = (value: number, options?: ConvertCurrencyOptions) => {
  const { type = 'integer' } = options ?? {};

  if (type === 'integer') {
    return value / 100;
  }

  return value * 100;
};

type GetWeekdayProps = {
  weekday: number;
  format?: string;
};

export const getWeekday = (props: GetWeekdayProps) => {
  const { weekday, format = 'ddd' } = props;

  return dayjs()
    .day(weekday)
    .format(format)
    .replace(/^./, (char) => char.toUpperCase());
};

export async function generateHashID(strings: string[]): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(strings.join('-'));

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashInt = hashArray.slice(0, 4).reduce((acc, byte, i) => acc + (byte << (i * 8)), 0);

  return Math.abs(hashInt).toString(36).padStart(8, '0').slice(0, 8);
}

export const cepFormatter = (value: string | null): string | null => {
  if (value === null) {
    return '';
  }

  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export function removeNonNumeric(str: string): string {
  return str.replace(/\D/g, '');
}

export function removeNonAlphanumeric(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$|^\(?\d{2,3}\)?[-.\s]?\d{4,5}[-.\s]?\d{4}$/;

  return phoneRegex.test(phone);
};

export const getWhatsappLink = (phone: string): string => {
  const phoneCleared = getPhoneNumberUnformatted(phone);

  return `https://api.whatsapp.com/send?phone=55${phoneCleared}&type=phone_number&app_absent=0`;
};

export const formatNumericParity = (value: number | string) => {
  const parsedValue = typeof value === 'string' ? Number(value) : value;

  if (!parsedValue) {
    return 0;
  }

  return Number.isInteger(parsedValue) ? parsedValue : parsedValue.toFixed(2);
};

export const roundHighPrecisionDecimals = (input: string, decimalCount: number): string => {
  const num = parseFloat(input);

  if (isNaN(num)) {
    return '';
  }

  return num.toFixed(decimalCount);
};

export function encodeRedirectUrl(url: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(url);

  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = btoa(binary);

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeRedirectUrl(token: string): string {
  let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export const cepMask = (value: string | null): string | null => {
  if (value === null) {
    return '';
  }

  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const cpfMask = (value: string | null): string | null => {
  if (value === null) {
    return '';
  }

  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export function cpfValidator(cpf: string): number | boolean {
  const newCpfValue = cpf.replace(/[^\d]/g, '');

  if (newCpfValue.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(newCpfValue)) {
    return false;
  }

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(newCpfValue.charAt(i), 10) * (10 - i);
  }

  let firstDigit = 11 - (sum % 11);

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(newCpfValue.charAt(i), 10) * (11 - i);
  }

  let secondDigit = 11 - (sum % 11);

  if (firstDigit === 10 || firstDigit === 11) {
    firstDigit = 0;
  }

  if (secondDigit === 10 || secondDigit === 11) {
    secondDigit = 0;
  }

  return parseInt(newCpfValue.charAt(9), 10) === firstDigit && parseInt(newCpfValue.charAt(10), 10) === secondDigit;
}

export const cnpjMask = (value: string | null): string | null => {
  if (value === null) {
    return '';
  }

  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export function cnpjValidator(cnpj: string): boolean {
  const value = cnpj.replace(/[^\d]/g, '');

  if (value.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(value)) {
    return false;
  }

  const calcDigit = (base: string, weights: number[]): number => {
    const sum = base.split('').reduce((acc, digit, i) => acc + parseInt(digit, 10) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstDigit = calcDigit(value.slice(0, 12), firstWeights);
  const secondDigit = calcDigit(value.slice(0, 13), secondWeights);

  return parseInt(value.charAt(12), 10) === firstDigit && parseInt(value.charAt(13), 10) === secondDigit;
}

export const phoneMask = (value: string | null): string => {
  if (!value) {
    return '';
  }

  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const currencyMask = (value: string | number | null | undefined): string => {
  const digits = String(value ?? '').replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  const amount = parseInt(digits, 10) / 100;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

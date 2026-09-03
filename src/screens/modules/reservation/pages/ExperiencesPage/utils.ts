import { Dayjs } from 'dayjs';
import { PromoCode } from 'src/store/modules/bookingExperiences/reducer';

export interface BookingExperienceValuesInputFields {
  hall: string[];
  id: string;
  title: string;
  description: string;
  rules: string;
  initialDate: Dayjs;
  finalDate: Dayjs;
  initialTime: Dayjs;
  finalTime: Dayjs;
  price: number;
  allowSimpleBooking: boolean;
  limit?: number;
  promo_codes?: PromoCode[];
}

export interface ChangeStatusProps {
  id: string;
  active: boolean;
}

export const rules = {
  title: [{ required: true, message: 'Por favor, informe o título!' }],
  description: [{ required: true, message: 'Por favor, informe a descrição!' }],
  rules: [{ required: true, message: 'Por favor, informe as regras e condições!' }],
  initialDate: [{ required: true, message: 'Por favor, informe a data inicial!' }],
  finalDate: [{ required: true, message: 'Por favor, informe a data final!' }],
  initialTime: [{ required: true, message: 'Por favor, informe o horário inicial!' }],
  finalTime: [
    {
      required: true,
      message: 'Por favor, informe o horário final!',
    },
  ],
  price: [{ required: true, message: 'Por favor, informe o preço por pessoa!' }],
  hall: [{ required: true, message: 'Por favor, informe a sala!' }],
  refund_hours: [
    {
      required: true,
      message: 'Por favor, informe a antecedência mínima de estorno!',
    },
  ],
};

export const currencyConfig = {
  locale: 'pt-BR',
  formats: {
    number: {
      BRL: {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

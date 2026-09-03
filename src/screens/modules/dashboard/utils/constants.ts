export type PaymentWay = 'pix' | 'credit';

export type PaymentWayInfoProps = Record<
  PaymentWay,
  {
    color: string;
    text: string;
  }
>;

export const paymentWayInfo: PaymentWayInfoProps = {
  credit: {
    color: 'geekblue',
    text: 'Cartão de crédito',
  },
  pix: {
    color: 'green',
    text: 'PIX',
  },
};

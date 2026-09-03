import { ModuleCopy } from '../index';

export const voucherBentoGridContent: ModuleCopy = {
  title: 'Giftback',
  features: [
    {
      title: 'Fidelize clientes',
      description:
        'O Giftback é um voucher de desconto na próxima compra e pode ser uma ferramenta poderosa para fazer os clientes retornarem após a primeira visita!',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/customer-loyalty.webp`}
          />
        </div>
      ),
    },
    {
      title: 'Comunicação via SMS e e-mail',
      description:
        'Dispare e-mail e SMS aos clientes que frequentaram seu restaurante via fila ou reserva.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/user-communication.svg`}
          />
        </div>
      ),
    },
    {
      title: 'Incentive sua Pesquisa de Satisfação',
      description:
        'Envie um voucher de desconto aos clientes que responderam sua Pesquisa de Satisfação.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/discount.svg`}
          />
        </div>
      ),
    },
    {
      title: 'Customize do seu jeito',
      description:
        'Escolha a % do desconto, os dias de início e fim e o prazo que o cliente precisa retornar ao seu restaurante para ter o benefício.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/self-customization.webp`}
          />
        </div>
      ),
    },
  ],
};

import { Tag } from 'antd';
import type { ReactNode } from 'react';
import type { SellerStatus, SellerType } from 'src/store/modules/payment/reducer';

export const SellerTypeTag: Record<SellerType, ReactNode> = {
  business: (
    <Tag className="m-0" color="default">
      Pessoa Jurídica
    </Tag>
  ),
  individual: (
    <Tag className="m-0" color="geekblue">
      Pessoa Física
    </Tag>
  ),
};

export const SellerStatusTag: Record<SellerStatus, ReactNode> = {
  pending: (
    <Tag className="m-0" color="gold">
      Pendente
    </Tag>
  ),
  enabled: (
    <Tag className="m-0" color="green">
      Aprovado
    </Tag>
  ),
  denied: (
    <Tag className="m-0" color="red">
      Rejeitado
    </Tag>
  ),
};

export const sellerSegments: Array<{ name: string; value: string }> = [
  { name: 'Restaurantes', value: '5812' },
  { name: 'Bares, pubs, casas noturnas', value: '5813' },
  { name: 'Fast Food', value: '5814' },
  { name: 'Empórios e lojas gourmet', value: '5499' },
  { name: 'Experiências e entretenimento em geral', value: '7999' },
  { name: 'Outros', value: '8999' },
];

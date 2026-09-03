import { useState } from 'react';
import { Play } from '@styled-icons/fa-solid/Play';
import { Switch } from 'src/stories/entry/Switch';
import { ModuleCopy } from '../index';
import * as S from './styles';

const RealTimeEditing = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Entradas',
  ]);

  const handleChangeCategories = (insert: boolean, category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        if (insert === false) {
          return prev.filter((item) => item !== category);
        } else {
          return [...prev];
        }
      }

      return [...prev, category];
    });
  };

  return (
    <S.Content>
      <S.MenuEdit>
        <span className="menu-title">Menu principal</span>
        <div className="switch-content">
          <Switch
            label="Entradas"
            checked={selectedCategories.includes('Entradas')}
            onChange={(checked) => handleChangeCategories(checked, 'Entradas')}
          />
          <Switch
            label="Bebidas"
            checked={selectedCategories.includes('Bebidas')}
            onChange={(checked) => handleChangeCategories(checked, 'Bebidas')}
          />
        </div>
      </S.MenuEdit>
      <div className="line" />
      <S.Menu>
        {selectedCategories.map((category) => (
          <div key={category}>
            <Play size={8} />
            {category}
          </div>
        ))}
      </S.Menu>
    </S.Content>
  );
};

export const menuBentoGridContent: ModuleCopy = {
  title: 'Cardápio',
  features: [
    {
      title: 'QR Code',
      description:
        'Ofereça seu cardápio através de um QR Code na mesa para seus clientes. Reduza custos e agilize sua operação!',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/qrcode-scan.webp`}
          />
        </div>
      ),
    },
    {
      title: 'Link Compartilhável',
      description:
        'Facilite o compartilhamento e aumente a visibilidade do seu cardápio, compartilhando em suas redes sociais, WhatsApp ou qualquer outro canal que desejar.',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/link-share.webp`}
          />
        </div>
      ),
    },
    {
      title: 'Edite em tempo real',
      description:
        'Facilidade para atualizar itens do menu, preços e promoções em tempo real.',
      content: <RealTimeEditing />,
    },
    {
      title: 'Promoções',
      description:
        'Aumente a venda de itens com destaque em banners promocionais!',
      content: (
        <div className="content">
          <img
            src={`${
              import.meta.env.VITE_CDN_BASE_URL
            }/frontend/shared/modules/person-menu.webp`}
          />
        </div>
      ),
    },
  ],
};

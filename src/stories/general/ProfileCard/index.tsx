import React from 'react';
import * as S from './styles';
import Avatar from 'src/stories/display/Avatar';
import Title from 'src/stories/typography/Title';

export type ProfileProps = {
  /**
   * Name of the profile
   */
  name?: string;
  /**
   * Profile logo/avatar image source
   */
  logo?: string;
  logoSize?: number;
  /**
   * An optional cover
   */
  cover?: string;
  loading?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Profile card with logo and some informations about it
 */
const ProfileCard = ({
  name,
  logo,
  logoSize = 90,
  cover,
  loading = false,
  children,
  ...props
}: ProfileProps) => (
  <S.Wrapper {...props}>
    <S.ImageBox>
      {!loading && cover && <img src={cover} alt="Imagem de Capa do Perfil" />}
    </S.ImageBox>
    <S.Logo>
      <Avatar size={logoSize} src={logo} alt={name} />
    </S.Logo>
    <S.Information>
      <Title
        aria-label={!loading ? name : 'Carregando Informações...'}
        level={4}
      >
        {!loading ? name : 'Carregando Informações...'}
      </Title>
    </S.Information>
    {!!children && children}
  </S.Wrapper>
);

export default ProfileCard;

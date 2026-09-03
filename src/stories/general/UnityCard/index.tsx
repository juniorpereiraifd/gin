import React from 'react';
import * as S from './styles';
import Space from 'src/stories/utils/Space';
import { Skeleton } from 'antd';

export type UnityProps = {
  name?: string;
  location?: string;
  cover?: string;
  logo?: string;
  halls?: number;
  loading?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
  status?: 'listed' | 'not-listed' | 'suspended' | 'disabled';
  href?: string;
};

const styles = {
  loading: {
    width: '100%',
  },
};

const UnityCard = ({
  name,
  location,
  cover,
  logo,
  loading = false,
  status = 'listed',
  onClick,
  href,
}: UnityProps) => (
  <S.Wrapper
    boxAs="link"
    href={href}
    padding="none"
    onClick={onClick}
    status={status}
  >
    {status === 'not-listed' && (
      <S.Flag type="not-listed">
        <span>• NÃO-LISTADO</span>
      </S.Flag>
    )}
    {status == 'disabled' && (
      <S.Flag type="disabled">
        <span>• DESATIVADO</span>
      </S.Flag>
    )}
    {status === 'suspended' && (
      <S.Flag type="suspended">
        <span>• SUSPENSO</span>
      </S.Flag>
    )}
    {loading ? (
      <S.LoadingWrapper>
        <Skeleton.Image style={styles.loading} />
        <Skeleton.Input active />
      </S.LoadingWrapper>
    ) : (
      <Space size={15} direction="vertical">
        <S.ImageBox>
          <S.Logo src={logo} size={65} alt={name} />
          {(cover ?? null) !== null && cover !== '' && (
            <img src={cover} alt="Imagem de capa da unidade" />
          )}
        </S.ImageBox>
        <S.UnitInfo>
          <span className="unit-name">{name}</span>
          <span>{location}</span>
        </S.UnitInfo>
      </Space>
    )}
  </S.Wrapper>
);

export default UnityCard;

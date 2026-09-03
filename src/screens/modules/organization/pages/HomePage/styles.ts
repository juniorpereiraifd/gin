import styled, { css } from 'styled-components';
import { Home } from '@styled-icons/boxicons-regular/Home';
import { Modal as CustomModal, List } from 'antd';
import media from 'styled-media-query';

export const Container = styled.div`
  max-width: 1440px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin-inline: auto;
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.xxsmall};
  `}
`;

export const Filters = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: flex-end;
    gap: 1.25rem;
    margin-block: 1.25rem;

    > .search-input {
      width: 15.62rem;
      display: flex;
      flex-direction: column;
      gap: 0.312rem;

      label.unity-search {
        font-size: ${theme.font.sizes.small};
      }
    }
  `}
`;

export const UnitList = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(1, auto);
  grid-template-rows: auto;
  gap: 1.25rem;

  @media only screen and (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media only screen and (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;

  flex: 1;
`;

export const HomeIcon = styled(Home)`
  padding-bottom: 5px;
`;

export const Search = styled.div`
  align-items: center;
  display: flex;
  input {
    width: 30%;
    border-radius: 4px;
    ${({ theme }) => css`
      margin-right: ${theme.spacings.xsmall};
    `}
  }

  ${media.lessThan('medium')`
    width: 80%;
    align-self: center;
    flex-direction: column;

    margin-top: 1.25rem;

    input {
      width: 100%;
      margin: 0;
      margin-bottom: 0.625rem;
    }

    button {
      width: 100%;
      margin-bottom: 0.625rem;
    }
  `}

  ${media.lessThan('small')`
    width: 100%;
  `}
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Modal = styled(CustomModal)`
  .ant-modal-content {
    border-radius: 8px;
  }
  color: #676666;
  h3 {
    margin-bottom: 15px;
  }
`;

export const ButtonModal = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;

  .whatsapp {
    display: none;
    background: #4dc247;
    color: #fff;
    border-color: #4dc247;

    svg {
      color: #fff;
      margin-right: 5px;
    }

    &:hover {
      color: #fff;
      opacity: 0.8;
    }
  }
`;

export const WrapperClearFiltersButton = styled.div`
  margin-left: 15px;

  ${media.lessThan('medium')`
    width: 100%;
    margin-left: 0;
  `}
`;

export const WrapperFilterById = styled.div`
  max-width: 9.37rem;

  ${media.lessThan('medium')`
    max-width: none;
    width: 100%;
    margin-right: 0;
  `}
`;

export const CustomList = styled(List)``;

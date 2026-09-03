import { Button as CustomButton, List } from 'antd';
import styled, { css } from 'styled-components';

type ContentImageButtonProps = {
  type: 'primary' | 'secondary';
};

type ContainerProps = {
  size: 'large' | 'medium' | 'small';
};

export const Container = styled.div<ContainerProps>`
  height: fit-content;

  ${({ theme, size }) => {
    const variablesSize = {
      large: '100%',
      medium: '75%',
      small: '50%',
    };

    return css`
      width: ${variablesSize[size]};
      background-color: ${theme.colors.backgroundGray};
      border-radius: 8px;
      border: 1px solid ${theme.colors.grayBorder};
    `;
  }}

  input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1.25rem;
`;

export const ContentTitleHeader = styled.div`
  ${({ theme }) => css`
    h4 {
      color: ${theme.colors.highContrast};
    }
  `}
`;

export const WrapperList = styled.div`
  height: 15rem;
  overflow-y: auto;
`;

export const ItemList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  ${({ theme }) => css`
    border-radius: 8px;
    background-color: ${theme.colors.white};
  `}

  box-shadow: 0px 4px 12px rgba(20, 20, 20, 0.2);

  padding: 1.25rem;
  margin-bottom: 1.25rem;

  .ant-form-vertical {
    width: 100%;
  }
`;

export const BodyForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1.25rem;

  border-radius: 0 0 8px 8px;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;

export const WrapperFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
`;

export const ContentInputFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  margin-top: 1.25rem;
`;

export const HelperFooter = styled.p`
  font-size: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 0;

  ${({ theme }) => css`
    color: ${theme.colors.midContrast};
  `}
`;

export const ContentInfoFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 80%;
`;

export const WrapperAddTable = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerItemForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;

  .ant-form-item {
    margin: 0;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const ButtonCircle = styled(CustomButton)`
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 350ms;
`;

export const ContentImageButton = styled.div<ContentImageButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 1.875rem;
  height: 1.875rem;

  border-radius: 50% 50%;

  transition: 200ms;

  ${({ theme, type }) => css`
    ${type === 'primary' &&
    css`
      color: ${theme.colors.brand[700]};
    `}
    ${type === 'secondary' &&
    css`
      color: ${theme.colors.midContrast};
    `}
  `}

  &:hover {
    ${({ theme, type }) => css`
      ${type === 'primary' &&
      css`
        color: ${theme.colors.brand[500]};
      `}
      ${type === 'secondary' &&
      css`
        color: ${theme.colors.darkGray};
      `}
    `}
  }
`;

export const StyledList = styled(List)`
  padding: 15px 15px 0px 15px;
`;

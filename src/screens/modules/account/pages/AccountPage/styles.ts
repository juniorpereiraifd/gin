import styled, { css } from 'styled-components';
import {
  Col,
  Tabs as CustomTabs,
  Modal as CustomModal,
  Tag as CustomTag,
} from 'antd';
import { Camera as CustomCamera } from '@styled-icons/heroicons-outline/Camera';
import { Image as CustomImage } from '@styled-icons/boxicons-regular/Image';

const { TabPane } = CustomTabs;

export const InputWrapper = styled.div`
  display: flex;
  align-items: top;
  > .ant-form-item {
    width: 60%;
    ${({ theme }) => css`
      margin-right: ${theme.spacings.medium};
    `}
  }

  ${({ theme }) => css`
    small {
      color: ${theme.colors.lightSecondary};
      font-size: ${theme.font.sizes.small};
      max-width: 35%;
      margin-top: ${theme.spacings.small};
    }
  `}
`;

export const TimeWrapper = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;

  ${({ theme }) => css`
    small {
      color: ${theme.colors.lightSecondary};
      font-size: ${theme.font.sizes.small};
      max-width: 35%;
      margin-top: ${theme.spacings.small};
    }
  `}
`;

export const InputWrapperDuo = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  .ant-form-item {
    width: 49%;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => css`
    span {
      margin-left: ${theme.spacings.small};
      margin-bottom: ${theme.spacings.small};
    }
  `}
`;

export const NotificationWrapper = styled.div`
  display: flex;
`;

export const EmailsWrapper = styled.div`
  width: 100%;
`;

export const Main = styled(Col)`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.medium};
    padding: 0 !important;
  `}
`;

export const Pane = styled(TabPane)`
  ${({ theme }) => css`
    border-radius: ${theme.border.radius.large};
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.white};
    padding: ${theme.spacings.xsmall} ${theme.spacings.xsmall};
  `};
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

import ImageUpload from 'src/stories/entry/ImageUpload';

export const Camera = styled(CustomCamera)`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.xxxsmall};
  `}
`;

export const Image = styled(CustomImage)`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.xxxsmall};
  `}
`;

export const Logo = styled(ImageUpload)`
  width: 100%;
`;

export const LogoWrapper = styled.div`
  width: 30%;
`;

export const CoverWrapper = styled.div`
  width: 65%;
`;

export const UnityImages = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const ImageWrapper = styled.div`
  img {
    max-width: 100%;
    max-height: 400px;
    height: 200px;
  }
`;

export const Modal = styled(CustomModal)`
  color: #676666;
  h3 {
    color: #dd4f50;
    margin-bottom: 15px;
  }
`;

export const Tag = styled(CustomTag)`
  background: #e6ecf2;
  border-radius: 28px;
  color: #20252a;
  font-weight: bold;
`;

export const ButtonModal = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 15px;
`;

export const CenterButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  small {
    margin-top: 10px;
  }
`;

export const ColorStatus = styled.span`
  color: #676666;
`;

export const TextStatus = styled.p`
  font-size: 0.875rem;
`;

export const SwitchNewInGetInWrapper = styled.div<{ isDisabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;

  span {
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 133%;
  }

  .ant-switch-loading,
  .ant-switch-disabled {
    opacity: 0.3;
  }

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      color: ${({ theme }) => theme.colors.midContrast};
    `}
`;

export const Content = styled.div`
  grid-column: 1;
  grid-row: 2;
`;

export const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  grid-column: 2;
  grid-row: 2;
`;

export const StatusModalTitle = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};
  `};
`;

export const CurrencyFieldWrapper = styled.div`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.xxxsmall};

    width: 60%;
    display: flex;
    align-items: center;
    gap: 1.875rem;
    margin-right: 3.2rem;

    .ant-form-item {
      flex: 1;
    }

    .money-sign-content {
      > svg.currency-dollar {
        color: ${theme.colors.gray};
      }

      > svg.currency-dollar.active {
        color: ${theme.colors.primary};
      }
    }
  `}
`;

export const FormItemLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

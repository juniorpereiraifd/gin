import { Button, Upload as BaseUpload, Tooltip as BaseTooltip } from 'antd';
import { BannerBase } from 'src/store/modules/menu/reducer';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1024px;

  display: flex;
  flex-direction: column;

  gap: 1.25rem;

  margin-bottom: 1.25rem;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.625rem;
  padding-inline: 1.25rem;

  ${({ theme }) => css`
    form {
      width: 100%;
      height: 42.5rem;

      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.625rem;

      overflow: hidden;

      .ant-form-item {
        margin: 0;
      }

      .active-switch {
        align-items: center;
        flex-direction: row;
        gap: 0.625rem;

        .ant-form-item-label {
          padding: 0;
        }
      }

      .provider-container {
        display: flex;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: ${theme.colors.grayLight};
        border-radius: ${theme.border.radius.medium};

        .dropzone {
          flex: 1;
          width: 100%;
          height: 100%;

          .grid-item {
            padding: 0.625rem 0.625rem 0.625rem 0.625rem;
          }
        }
      }
    }
  `}

  > button[type='submit'] {
    width: fit-content;
  }
`;

type BannerFieldsContentProps = {
  saving: boolean;
};

export const BannerFieldsContent = styled.div<BannerFieldsContentProps>`
  display: flex;
  height: fit-content;
  flex-direction: column;
  gap: 0.625rem;

  padding: 0.625rem 1rem;

  .ant-form-item.upload-field-item {
    margin: 0;
  }

  ${({ theme, saving }) => css`
    border-radius: ${theme.border.radius.medium};
    border: 1px solid ${theme.colors.grayBorder};
    background-color: ${theme.colors.white};

    > div.card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      svg {
        color: ${theme.colors.midContrast};
      }

      span,
      .delete-trigger {
        cursor: ${saving ? 'not-allowed' : 'pointer'};
      }
    }
  `}
`;

export const AddBannerFieldsButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.312rem 0.8rem;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xsmall};
    font-weight: ${theme.font.bold};
    border-radius: ${theme.border.radius.normal};
  `}
`;

type UploadProps = {
  bannerType: BannerBase['type'];
};

export const Upload = styled(BaseUpload)<UploadProps>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  cursor: pointer;

  .ant-upload-select {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  ${({ theme, bannerType }) => css`
    height: ${bannerType === 'home' ? '32rem' : '15rem'};

    border-radius: ${theme.border.radius.medium};
    border: 1px dashed ${theme.colors.darkGray};
    background-color: ${theme.colors.mainBg};

    svg {
      color: ${theme.colors.darkGray};
    }
  `}
`;

export const PreviewImage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`;

export const Tooltip = styled(BaseTooltip)`
  width: fit-content !important;
  height: fit-content !important;
`;

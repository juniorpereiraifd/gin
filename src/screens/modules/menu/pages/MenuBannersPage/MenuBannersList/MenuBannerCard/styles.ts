import styled, { css } from 'styled-components';
import { Upload as BaseUpload } from 'antd';
import { BannerBase } from 'src/store/modules/menu/reducer';

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
    height: ${bannerType === 'home' ? '20rem' : '6.25rem'};

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

export const DetailUploadPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;

  ${({ theme }) => css`
    > span.dimensions {
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors.midContrast};
    }
  `}
`;

import { Col } from 'antd';
import { Select as CustomSelect } from 'src/stories/entry';
import styled, { css } from 'styled-components';

export const Wrapper = styled(Col)`
  display: flex;
  flex-direction: column;

  gap: 1.25rem;

  .send-button {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    margin-left: auto;

    min-width: 9.4rem;
    min-height: 1.875rem;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  span {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    gap: 0.625rem;
  }
`;

export const Back = styled.p`
  width: fit-content;

  ${({ theme }) => css`
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.medium};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.totalContrast};

    margin: auto 0;

    &:hover {
      cursor: pointer;
    }

    svg {
      margin-right: 0.312rem;
    }
  `}
`;

export const NewCampaign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 1rem 1.25rem 1.25rem;
  gap: 1.5rem;

  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const CampaignTags = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  p {
    margin: 0;
  }
`;

export const Select = styled(CustomSelect)`
  width: 100%;
`;

export const DatesWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.border.radius.medium};
  `}

  align-items: center;
  justify-content: flex-start;
`;

export const WarningWrapper = styled.div`
  width: 100%;
  gap: 1rem;

  ${({ theme }) => css`
    p {
      font-weight: ${theme.font.medium};
    }
  `}
`;

export const EmailContentInfo = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: center;

  padding: 1rem;
  gap: 1.5rem;

  min-height: 15.5rem;

  ${({ theme }) => css`
    background: ${theme.colors.surface};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const SMSContentInfo = styled.div`
  width: 100%;
  min-height: 24.8rem;

  display: flex;
  flex-direction: column;

  padding: 1rem;
  gap: 1.5rem;

  ${({ theme }) => css`
    background: ${theme.colors['neutral-lightest']};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const SpaceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Separator = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => css`
    button {
      color: ${theme.colors.totalContrast};
    }
  `}
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 0.312rem;
`;

export const InfoTitle = styled.h6`
  ${({ theme }) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.medium};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.highContrast};
  `}
`;

export const InfoDescription = styled.p`
  margin: 0;

  ${({ theme }) => css`
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.xsmall};
    line-height: ${theme.font.sizes.medium};

    color: ${theme.colors.midContrast};
  `}
`;

export const EmailContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.25rem;
`;

export const EmailContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 1rem 1.25rem;
  gap: 1rem;

  width: 55%;

  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.border.radius.medium};

    p {
      font-weight: ${theme.font.medium};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      color: ${theme.colors.highContrast};
    }
  `}

  .save-mail-button {
    margin-left: auto;
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.312rem;

  align-items: flex-start;
  justify-content: flex-start;
`;

export const InputBanner = styled.label`
  cursor: pointer;

  width: 100%;
  min-width: 31.5rem;
  min-height: 3.6rem;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 0.625rem;
  padding: 0.6rem 0.625rem;

  ${({ theme }) => css`
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.midContrast};
    border-radius: ${theme.border.radius.normal};
  `}

  > div {
    padding: 0.2rem 0.8rem;

    min-width: 6.1rem;
    min-height: 1.5rem;

    ${({ theme }) => css`
      background: ${theme.colors.highContrast};
      border-radius: ${theme.border.radius.normal};
      color: ${theme.colors.white};

      font-style: normal;
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.small};
      line-height: ${theme.font.sizes.xlarge};
    `}
  }

  > span {
    ${({ theme }) => css`
      font-style: normal;
      font-weight: ${theme.font.medium};
      font-size: ${theme.font.sizes.xsmall};
      line-height: ${theme.font.sizes.medium};

      color: ${theme.colors.totalContrast};
    `}
  }
`;

export const FileDescription = styled.p`
  margin: 0;

  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.xsmall};
    line-height: ${theme.font.sizes.medium};

    color: ${theme.colors.midContrast};
  `}
`;

export const CustomButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 1rem;
`;

export const CustomButtonSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.625rem;
`;

export const EmailContentPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.625rem 1.25rem 1.25rem;
  gap: 1.25rem;

  width: 45%;

  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const ContentPreview = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: center;

  padding: 0.312rem;
  gap: 1.25rem;

  width: 100%;
  max-width: 35.5rem;

  height: 100%;

  pointer-events: none;
  user-select: none;

  .texts {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    justify-content: center;
    align-items: center;

    margin: 0 1.875rem;

    button {
      min-width: 9.3rem;
      min-height: 1.5rem;
    }

    h2,
    p {
      text-align: center;
    }
  }

  ${({ theme }) => css`
    min-height: 35.625rem;
    border: 1px solid ${theme.colors.neutralDark};

    p {
      margin: 0;

      font-weight: ${theme.font.medium};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      color: ${theme.colors.highContrast};
    }
  `}
`;

export const ImagePreviewWrapper = styled.div`
  width: 100%;
  max-width: 34.5rem;
  height: 10rem;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: inherit;
    max-width: inherit;
    height: inherit;

    object-fit: cover;
    object-position: center;
  }

  ${({ theme }) => css`
    background: ${theme.colors.surface};
  `}
`;

export const ImageHelper = styled.h6`
  ${({ theme }) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.midContrast};
  `}
`;

export const FooterPreview = styled.div`
  width: 100%;
  max-width: 34.5rem;
  height: 6.875rem;

  margin-top: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => css`
    background: ${theme.colors.surface};

    span {
      font-size: ${theme.font.sizes.xxxsmall};
      line-height: 0.625rem;
      color: ${theme.colors.highContrast};

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .highlited {
      color: ${theme.colors.totalContrast};
      font-size: ${theme.font.sizes.xxsmall};
      font-weight: ${theme.font.bold};
      line-height: 1.33rem;
    }
  `}
`;

export const FooterChild = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0.625rem;
  height: 5.5rem;

  text-align: center;

  svg {
    height: 1.1rem;
    width: 1.875rem;
  }
`;

export const Line = styled.hr`
  width: inherit;
  height: 0px;

  margin: 0;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.grayNeutralPure};
  `}
`;

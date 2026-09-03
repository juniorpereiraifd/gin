import styled, { css } from 'styled-components';

export const Wrapper = styled.div<{
  rowDirection?: boolean;
  hasOnClickOnLabel: boolean;
  minHeight?: string;
}>`
  width: 100%;
  display: flex;
  justify-content: flex-start;

  ${({ theme, rowDirection, minHeight, hasOnClickOnLabel }) => css`
    flex-direction: ${rowDirection ? 'row' : 'column'};
    align-items: ${rowDirection ? 'center' : 'flex-start'};
    gap: ${rowDirection ? '1rem' : '0.5rem'};

    label + div {
      width: 100%;

      input {
        min-height: ${minHeight ? minHeight : 'unset'};
      }
    }

    label + input {
      min-height: ${minHeight ? minHeight : 'unset'};
    }

    p {
      margin: 0 !important;

      font-weight: ${theme.font.medium} !important;
      font-size: ${theme.font.sizes.xsmall} !important;
      line-height: ${theme.font.sizes.medium} !important;

      color: ${theme.colors.totalContrast} !important;
    }

    label {
      cursor: ${hasOnClickOnLabel ? 'pointer' : 'initial'};

      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      color: ${theme.colors.totalContrast};

      svg {
        margin-left: 0.312rem;
        color: ${theme.colors.midContrast};
      }
    }
  `}
`;

export const HeadingWrapper = styled.div`
  margin-bottom: 0.625rem;
`;

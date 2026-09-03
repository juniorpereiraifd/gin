import styled, { css, DefaultTheme } from 'styled-components';

const buttonModifiers = {
  outline: (theme: DefaultTheme) => css`
    color: ${theme.colors.totalContrast};
    background-color: transparent;

    border: 1px solid ${theme.colors.totalContrast};
  `,

  brandSecondary: (theme: DefaultTheme) => css`
    color: ${theme.colors.grayLight};
    background-color: ${theme.colors.brandSecondaryPure};
  `,

  disabled: () => css`
    cursor: not-allowed !important;

    &:hover {
      opacity: 0.9;
    }
  `,
};

export const Container = styled.div<{ gap: '1.5' | '3' }>`
  width: 100%;
  padding: 1.25rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  transition: 0.6s;

  ${({ gap }) => css`
    gap: ${gap}rem;
  `}
`;

export const Title = styled.h4`
  ${({ theme }) => css`
    color: ${theme.colors.totalBlack};

    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.large};
  `}
`;

export const Text = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.highContrast};

    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.small};
    line-height: 133%;

    span {
      font-weight: ${theme.font.bold};
      color: ${theme.colors.black};
    }
  `}
`;

export const DropContainer = styled.label`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 16.5rem;
  width: 100%;

  cursor: pointer;
  transition: background 0.2s ease-in-out, border 0.2s ease-in-out;

  gap: 0.625rem;
  padding: 1rem 0.625rem;

  ${({ theme }) => css`
    color: ${theme.colors.grayNeutralDark};

    background-color: ${theme.colors.surface};

    border: 1px dashed ${theme.colors.grayNeutralPure};
    border-radius: ${theme.border.radius.medium};

    &:hover {
      background-color: white;
    }
  `}

  svg {
    width: 2.5rem;
    height: 3.125rem;
  }
`;

export const DropTitle = styled.span`
  ${({ theme }) => css`
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.xxsmall};

    line-height: 133%;
    text-align: center;

    color: ${theme.colors.midContrast};
  `}
`;

export const InputFile = styled.input`
  ${({ theme }) => css`
    display: hidden;
    width: 85%;
    height: 4.8rem;

    padding: 0.312rem;
    border-radius: 0.8rem;

    border: 1px solid ${theme.colors.totalContrast};
    color: ${theme.colors.totalContrast};

    cursor: pointer;

    &::file-selector-button {
      transition: background 0.2s ease-in-out;

      padding: 0.312rem;

      background-color: ${theme.colors.grayNeutralDark};
      color: ${theme.colors.white};
      font-size: ${theme.font.sizes.xsmall};

      border: none;
      border-radius: ${theme.border.radius.medium};
    }
  `}
`;

export const LoadingWrapper = styled.div`
  width: 100%;
  height: 13.3rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export const Feedback = styled.div`
  ${({ theme }) => css`
    width: 100%;
    text-align: center;

    h2 {
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes['3xlarge']};

      color: ${theme.colors.brandSecondaryLight};
    }
  `}
`;

export const Subtitle = styled.h5<{ color: 'highContrast' | 'monoLowDark' }>`
  ${({ theme, color }) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.medium};

    color: ${theme.colors[color]};

    img {
      margin-right: 0.75rem;
      margin-bottom: 0.312rem;
    }
  `}
`;

export const Button = styled.button<{
  typeStyle?: 'outline' | 'brandSecondary';
  disabled?: boolean;
}>`
  ${({ theme, typeStyle, disabled }) => css`
    width: 100%;
    border: none;

    border-radius: ${theme.border.radius.medium};

    padding: 0.75rem, 1.125rem, 0.75rem, 1.125rem;
    height: 4.9rem;

    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.large};
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 1.125rem;
      height: 1.125rem;

      margin-right: 0.625rem;
    }

    &:hover {
      cursor: pointer;
    }

    ${!!typeStyle &&
    buttonModifiers[typeStyle as keyof typeof buttonModifiers](theme)}

    ${!!disabled && buttonModifiers.disabled()}
  `}
`;

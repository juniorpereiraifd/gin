import styled, { css, DefaultTheme } from 'styled-components';
import { BoxProps } from '.';

type WrapperProps = Pick<
  BoxProps,
  'type' | 'padding' | 'removeShadow' | 'status'
>;

const wrapperModifiers = {
  default: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.border};
  `,
  success: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.success};
    border: 1px solid ${theme.colors.darkSuccess};
  `,
  warning: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.warning};
    border: 1px solid ${theme.colors.darkWarning};
  `,
  danger: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.danger};
    border: 1px solid ${theme.colors.darkDanger};
  `,
};

const paddingModifiers = {
  small: (theme: DefaultTheme) => css`
    padding: ${theme.spacings.xxxsmall} ${theme.spacings.xsmall};
  `,
  normal: (theme: DefaultTheme) => css`
    padding: ${theme.spacings.xxsmall} ${theme.spacings.xsmall};
  `,
  large: (theme: DefaultTheme) => css`
    padding: ${theme.spacings.xsmall} ${theme.spacings.xsmall};
  `,
  none: () => css`
    padding: 0;
  `,
};

const statusModifiers = {
  listed: () => css``,
  'not-listed': () => css`
    background-color: #fff9ea !important;
    opacity: 0.7;
  `,
  suspended: () => css`
    background-color: white !important;
    opacity: 0.7;
  `,
  disabled: () => css`
    background-color: #f0f3f4 !important;
    opacity: 0.7;
  `,
};

export const Wrapper = styled.div<WrapperProps>`
  ${({ theme, type, padding, removeShadow, status }) => css`
    box-shadow: ${removeShadow ? null : theme.shadows.small};
    border-radius: ${theme.border.radius.large};
    border: 1px solid ${theme.colors.border};

    ${!!type && wrapperModifiers[type](theme)}
    ${!!padding && paddingModifiers[padding](theme)}
    ${!!status && statusModifiers[status]}
  `};
`;

export const LinkWrapper = styled.a<WrapperProps>`
  ${({ theme, type, padding, removeShadow, status }) => css`
    box-shadow: ${removeShadow ? null : theme.shadows.small};
    border-radius: ${theme.border.radius.medium};

    ${!!type && wrapperModifiers[type](theme)}
    ${!!padding && paddingModifiers[padding](theme)}
    ${!!status && statusModifiers[status]}
  `};
`;

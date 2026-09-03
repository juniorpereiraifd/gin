import styled, { css, DefaultTheme } from 'styled-components';
import { TitleProps } from '.';

type WrapperProps = Pick<
  TitleProps,
  'level' | 'isGrab' | 'icon' | 'linkStyleOnHover' | 'floatLeft'
>;

const wrapperModifiers = {
  1: (theme: DefaultTheme) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes['3xlarge']};
  `,
  2: (theme: DefaultTheme) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.xlarge};
  `,
  3: (theme: DefaultTheme) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.large};
  `,
  4: (theme: DefaultTheme) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.medium};
  `,
  5: (theme: DefaultTheme) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
  `,
  6: (theme: DefaultTheme) => css`
    font-size: ${theme.font.sizes.small};
    font-weight: normal;
  `,
};

export const Title = styled.h1.attrs<WrapperProps>(({ level }) => ({
  as: `h${level}`,
}))<WrapperProps>`
  ${({ theme, level, isGrab, icon, linkStyleOnHover }) => css`
    ${!!level && wrapperModifiers[level](theme)};
    color: ${theme.colors.darkSecondary};
    justify-content: center;
    align-items: center;

    > span {
      margin-right: ${icon ? theme.spacings.xsmall : null};
      cursor: ${isGrab ? 'grabbing' : null};
    }

    :hover {
        cursor: ${linkStyleOnHover ? 'pointer' : null};
        color: ${linkStyleOnHover ? theme.colors.primary : null};
      }
    }
  `}
`;

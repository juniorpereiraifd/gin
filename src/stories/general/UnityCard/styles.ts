import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import Box from 'src/stories/general/Box';
import Avatar from 'src/stories/display/Avatar';

export const Logo = styled(Avatar)`
  position: absolute;
  ${({ theme }) => css`
    border: 2px solid ${theme.colors.white};
  `}
  top: 2.18rem;
  left: 1.875rem;
`;

export const Wrapper = styled(Box)`
  ${({ theme }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: ${theme.colors.white};
    transition: all 0.2s ease-in-out;
    filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
    border-radius: ${theme.border.radius.normal};
    border: 1px solid ${theme.colors['zinc-200']};
    &:hover {
      border: 1px solid ${theme.colors.borderFocused};
      box-shadow: ${theme.shadows.medium};
      cursor: pointer;
    }

    svg {
      color: ${theme.colors.primary};
      margin-right: ${theme.spacings.xxsmall};
    }
  `}
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ImageBox = styled.div`
  height: 6.25rem;
  width: 100%;
  background: #f6f7f8;
  ${({ theme }) => css`
    border-radius: ${theme.border.radius.normal};
  `}

  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 50rem 8.75rem;
  animation: placeholderShimmer 1s linear infinite forwards;
  img {
    width: 100%;
    height: 100%;
    ${({ theme }) => css`
      border-radius: ${theme.border.radius.normal};
    `}
    object-fit: cover;
  }
  @keyframes placeholderShimmer {
    0% {
      background-position: -40rem 0;
    }
    100% {
      background-position: 15.62rem 0;
    }
  }
`;

type TypeProps = {
  [key: string]: () => FlattenSimpleInterpolation;
};

const typeModifiers: TypeProps = {
  'not-listed': () => css`
    background-color: #ffe5a1;
  `,
  suspended: () => css`
    background-color: black;
    span {
      color: white;
    }
  `,
  disabled: () => css`
    background-color: #908f8f;
    span {
      color: white;
    }
  `,
};

export const Flag = styled.div<{ type: string }>`
  position: absolute;
  right: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  opacity: 1;

  ${({ theme, type }) => css`
    box-shadow: ${theme.box.shadow};
    border-radius: ${theme.border.radius.normal};
    padding: ${theme.spacings.xxxsmall};
    span {
      font-size: ${theme.font.sizes.xsmall};
      font-weight: bold;
    }

    ${!!type && typeModifiers[type]}
  `}
`;

export const UnitInfo = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    > span.unit-name {
      font-size: ${theme.font.sizes.small};
      font-weight: ${theme.font.semiBold};
      color: ${theme.colors.textContrast};
    }
  `}
`;

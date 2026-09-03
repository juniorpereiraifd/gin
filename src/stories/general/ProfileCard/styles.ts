import styled, { css } from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 15rem;
  h4 {
    text-align: center;
  }
`;

export const Logo = styled.div`
  margin-top: -3.25rem;
  border-radius: 50%;
  ${({ theme }) => css`
    padding: 0.312rem;
    background-color: ${theme.colors.white};
  `};
`;

export const Information = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.spacings.xxxsmall};
    padding: 0 ${theme.spacings.xsmall};
    padding-bottom: ${theme.spacings.xsmall};
  `};
`;

export const ImageBox = styled.div`
  height: 8.125rem;
  width: 100%;
  background: #f6f7f8;

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

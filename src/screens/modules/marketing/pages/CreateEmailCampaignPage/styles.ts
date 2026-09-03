import styled, { css } from 'styled-components';

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
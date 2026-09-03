import styled, { css } from 'styled-components';
import Box from 'src/stories/general/Box';

export const Wrapper = styled(Box)<{ marginBottom?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? `${marginBottom}rem` : null};
`;

export const Left = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  svg:first-of-type {
    ${({ theme }) => css`
      margin-right: ${theme.spacings.xxsmall};
    `}
  }

  > svg {
    &:hover {
      cursor: pointer;
    }
  }

  > div {
    > svg {
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

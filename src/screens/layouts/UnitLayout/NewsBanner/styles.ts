import styled, { css } from 'styled-components';

export const PlanBodyModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${({ theme }) => css`
    div.section {
      div.title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;

        > span {
          font-size: ${theme.font.sizes.small};
          font-weight: ${theme.font.bold};
        }
      }

      ul {
        padding-left: 2rem;
      }
    }
  `}
`;

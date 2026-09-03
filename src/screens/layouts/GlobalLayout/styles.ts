import styled, { css } from 'styled-components';

export const AnnouncementBarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    > p {
      color: ${theme.colors.white};
      margin: 0;
    }

    .ant-divider {
      background-color: ${theme.colors.white};
    }

    img {
      width: 80px;
      height: 40px;
    }

    button {
      padding: 0;

      span {
        color: ${theme.colors.white};
        text-decoration: underline;
      }
    }
  `}
`;

export const AnnouncementModalContent = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    > img {
      border-radius: ${theme.border.radius.medium};
    }
  `}
`;

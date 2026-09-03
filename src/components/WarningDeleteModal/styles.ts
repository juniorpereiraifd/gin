import { Modal } from 'src/stories/feedback/Modal';
import styled, { css } from 'styled-components';

export const CustomModal = styled(Modal)`
  .ant-modal-header {
    ${({ theme }) => css`
      border-top-left-radius: ${theme.border.radius.medium};
      border-top-right-radius: ${theme.border.radius.medium};
    `}
  }
  .ant-modal-content,
  .ant-modal-close {
    padding: 0;
    ${({ theme }) => css`
      border-radius: ${theme.border.radius.medium};
    `}
  }
`;

export const Content = styled.h4`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1rem;
`;

export const Title = styled.h4`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};

    color: ${theme.colors.black};
  `}
`;

export const WrapperButtonActions = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => css`
    > button {
      border-radius: ${theme.border.radius.medium};

      transition: 350ms;

      &:hover {
        filter: brightness(1.3);
      }
    }

    > button.action-primary {
      background-color: ${theme.colors.redPrimary};
    }

    > button.action-secondary {
      color: ${theme.colors.black};
    }
  `}
`;

export const WrapperInput = styled.div`
  display: flex;
  flex-direction: column;
`;

import styled, { css } from 'styled-components';
import { Modal } from 'src/stories/feedback/Modal';

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
  justify-content: center;
`;

export const WrapperInput = styled.div`
  display: flex;
  flex-direction: column;
`;

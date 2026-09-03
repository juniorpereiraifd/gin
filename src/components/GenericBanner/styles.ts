import styled, { css } from 'styled-components';
import { Modal } from 'src/stories/feedback/Modal';

type WrapperButtonActions = {
  full?: boolean;
};

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

export const Title = styled.h4`
  margin-bottom: 1.25rem;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.large};
    font-weight: ${theme.font.bold};

    color: ${theme.colors.redPrimary};
  `}
`;

export const BodyContent = styled.div`
  margin-bottom: 0.625rem;
`;

export const BodyTitle = styled.h4`
  display: flex;
  align-items: center;
  margin-bottom: 0.625rem;
`;

export const BodyParagraph = styled.p`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
  `}
`;

export const WrapperTopContent = styled.div`
  margin-bottom: 1.25rem;
`;

export const WrapperButtonActions = styled.div<WrapperButtonActions>`
  width: 100%;

  display: flex;
  align-items: center;

  margin-top: 1.875rem;

  ${({ full }) => css`
    justify-content: ${full ? 'space-between' : 'flex-end'};
  `}
`;

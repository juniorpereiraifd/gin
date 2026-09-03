import { Col, Table as BaseTable } from 'antd';
import { Modal } from 'src/stories/feedback/Modal';
import styled, { css } from 'styled-components';

export const Wrapper = styled(Col)`
  ${({ theme }) => css`
    gap: ${theme.spacings.small};
  `}
`;

export const Content = styled.div`
  max-width: 100%;
  padding: 0.625rem 1rem;

  grid-column: 1;
  grid-row: 2;
  overflow: hidden;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    gap: ${theme.spacings.small};

    border-radius: ${theme.border.radius.medium};
  `}
`;

export const CardContent = styled.div`
  width: 100%;
  display: flex;

  overflow-x: auto;
  overflow-y: hidden;

  ${({ theme }) => css`
    gap: ${theme.spacings.small};
  `}
`;

export const RowButton = styled.div`
  width: 100%;
  margin-top: 1rem;

  display: inline-block;

  button {
    float: right;

    margin-left: 0.625rem;
  }
`;

export const CustomModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-content {
    border-radius: 0.8rem;
    padding: 0;
  }

  .ant-modal-header {
    display: none;
  }
`;

export const Table = styled(BaseTable)`
  ${({ theme }) => css`
    filter: ${theme['drop-shadow'].sm};
  `}
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
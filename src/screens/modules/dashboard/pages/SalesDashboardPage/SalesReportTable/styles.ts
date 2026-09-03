import styled, { css } from 'styled-components';
import { Button, Table as BaseTable } from 'antd';

export const TableSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ExportButton = styled(Button)`
  svg {
    margin-right: 0.625rem;
  }

  ${({ theme }) => css`
    border-radius: ${theme.borderRadius.sm};
  `}
`;

export const Table = styled(BaseTable)`
  ${({ theme }) => css`
    filter: ${theme['drop-shadow'].sm};
  `}
`;

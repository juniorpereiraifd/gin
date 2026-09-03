import styled, { css } from 'styled-components';

export const Name = styled.span`
  ${({ theme }) => css`
    max-width: 80%;
    font-size: ${theme.font.sizes.medium};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.textGrayPrimary};
  `}
`;

export const Body = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 15px 0;

  th {
    font-weight: normal;
    text-align: center;
    min-width: 13px;
  }

  tr {
    height: 0.5rem;
  }

  tr:last-child td {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    .active {
      border-radius: 10px;
    }
  }

  tr:first-child td {
    border-top-left-radius: 0.8rem;
    border-top-right-radius: 0.8rem;
  }

  tr.active:last-child td.active {
    background: black;
  }

  tbody::before {
    content: '-';
    display: block;
    line-height: 0.625rem;
    color: transparent;
  }
`;

type TableCellProps = {
  active?: boolean;
  statusHall?: boolean;
};

export const TableCell = styled.td<TableCellProps>`
  content: '';

  ${({ theme, active, statusHall }) => css`
    background-color: ${active
      ? statusHall
        ? theme.colors.brandSecondaryPure
        : '#919DAB'
      : theme.colors.semiDarkGray};
  `}
`;

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const BoxShowStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.625rem;
`;

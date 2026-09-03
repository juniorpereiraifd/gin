import styled, { css } from 'styled-components';
import { Pagination as CustomPagination } from 'antd';

export const Pagination = styled(CustomPagination)`
  background-color: none;
  border-radius: 10px;

  li {
    margin: 0;
    border-radius: 0;
    border-right: 0.5px solid #f2f2f2;
    border-left: 0.5px solid #f2f2f2;
    border-top: 1px solid #d9d9d9;
  }

  ${({ theme }) => css`
    .ant-pagination-item-active {
      background-color: ${theme.colors.primary};
      a {
        color: ${theme.colors.white};
        font-font-weight: ${theme.font.semiBold};
      }
    }
  `}

  .ant-pagination-prev {
    border-top: none;
    button {
      border-radius: 0;
      border-top-left-radius: 0.8rem;
      border-bottom-left-radius: 0.8rem;
      border-right: none;
    }
  }

  .ant-pagination-next {
    border-top: none;

    button {
      border-radius: 0;
      border-top-right-radius: 0.8rem;
      border-bottom-right-radius: 0.8rem;
      border-left: none;
    }
  }

  .ant-pagination-jump-next {
    background-color: white;
    border-bottom: 1px solid #d9d9d9;
  }

  .ant-pagination-jump-prev {
    background-color: white;
    border-bottom: 1px solid #d9d9d9;
  }
`;

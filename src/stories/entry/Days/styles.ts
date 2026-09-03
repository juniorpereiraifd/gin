import styled, { css, DefaultTheme } from 'styled-components';

const wrapperModifiers = {
  active: (theme: DefaultTheme) => css`
    background-color: ${theme.colors.brand['700']};
    color: ${theme.colors.white};

    &:hover {
      background-color: ${theme.colors.brand['900']};
    }
  `,
};

type Test = {
  active?: boolean;
};

export const Wrapper = styled.ul`
  display: flex;
  flex-direction: row;
  width: 100%;
  display: table;

  list-style: none;
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.gray};
    border-radius: 8px;
  `}
`;

export const Day = styled.li<Test>`
  ${({ theme, active }) => css`
    font-weight: ${theme.font.semiBold};
    text-align: center;
    display: table-cell;
    padding: 0.312rem 0px;
    width: 1.875rem;
    background-color: ${theme.colors.white};

    &:hover {
      cursor: pointer;
      background-color: ${theme.colors.lightGray};
    }

    ${!!active && wrapperModifiers.active(theme)}

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      margin-left: 5px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      margin-left: 5px;
    }
  `}
`;

import styled, { css } from 'styled-components';
import { Input } from 'antd';

const CustomTextArea = Input.TextArea;

export const TextArea = styled(CustomTextArea)`
  ${({ theme }) => css`
    &:focus {
      border-color: ${theme.colors.darkSecondary};
      outline: 0;
      -webkit-box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.2);
      box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.2);
    }
    &:hover {
      border-color: ${theme.colors.darkSecondary};
    }
  `}
`;

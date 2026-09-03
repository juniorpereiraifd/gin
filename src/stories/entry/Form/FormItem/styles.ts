import styled, { css } from 'styled-components';
import { Form as BaseForm } from 'antd';

type BaseFormItemProps = {
  hasHelpText: boolean;
};

export const BaseFormItem = styled(BaseForm.Item)<BaseFormItemProps>`
  ${({ theme, hasHelpText }) => css`
    ${hasHelpText === true &&
    css`
      .ant-form-item-explain {
        margin-bottom: 1.25rem;
      }
    `}
    .ant-form-item-explain {
      margin-top: 4px;
      font-size: ${theme.font.sizes.xsmall};
    }
  `}
`;

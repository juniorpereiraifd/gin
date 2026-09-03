import { Select as CustomSelect } from 'antd';
import styled from 'styled-components';

export default styled(CustomSelect)`
  .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: blue !important;
  }

  &:hover {
    .ant-select-selector {
      border-color: ${({ theme }) => theme.colors.darkSecondary} !important;
    }
  }
`;

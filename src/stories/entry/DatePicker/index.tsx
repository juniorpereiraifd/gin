import styled, { css } from 'styled-components';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import locale from 'antd/lib/date-picker/locale/pt_BR';

import 'antd/lib/date-picker/style/index';

const CustomDatePicker = generatePicker(dateFnsGenerateConfig);

const StyledDatePicker = styled(CustomDatePicker)`
  ${({ theme }) => css`
    .ant-picker-focused {
      border-color: !important ${theme.colors.darkSecondary};
      outline: 0;
      -webkit-box-shadow: !important 0 0 0 2px rgba(51, 51, 51, 0.2);
      box-shadow: !important 0 0 0 2px rgba(51, 51, 51, 0.2);

      &:focus {
        border-color: ${theme.colors.darkSecondary};
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.2);
        box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.2);
      }
    }

    :hover {
      border-color: ${theme.colors.darkSecondary};
    }
  `}
`;

const DatePicker = ({ ...props }) => <StyledDatePicker {...props} locale={locale} />;

export default DatePicker;

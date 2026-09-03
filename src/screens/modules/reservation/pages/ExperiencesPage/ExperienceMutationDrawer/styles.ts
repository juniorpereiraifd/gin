import { Col } from 'antd';
import styled from 'styled-components';

export const HelperTextContainer = styled(Col)`
  display: flex;
  flex-direction: column;
  margin-top: -1.2rem;

  > p {
    color: ${({ theme }) => theme.colors.textGray};
    font-size: 0.75rem;
    line-height: 133%;
    margin: 0;
  }
`;

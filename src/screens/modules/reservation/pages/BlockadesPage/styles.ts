import styled, { css } from 'styled-components';
import { DatePicker } from 'antd';
import { generateMedia } from 'styled-media-query';

export const customMedia = generateMedia({
  hugeScreen: '1441px',
});

export const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 278px;
  gap: 1.25rem;
`;

const { RangePicker } = DatePicker;

export const Wrapper = styled.div`
  width: 100%;
  min-height: 55vh;
  max-height: 55vh;
  overflow: auto;
`;

export const WrapperList = styled.div`
  grid-column: 1;
  grid-row: 2;
`;

export const CustomDatePicker = styled(RangePicker)`
  width: 100%;
`;

export const SwitchWrapper = styled.div`
  margin-bottom: 25px;
  ${({ theme }) => css`
    span {
      margin-left: ${theme.spacings.small};
    }
  `}
`;

export const Footer = styled.div`
  > button {
    margin: 0px 15px;
  }
`;

export const HourWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SideMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  gap: 1.25rem;

  grid-row-start: 2;
`;

export const WrapperContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
`;

export const SideBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const ContentList = styled.div`
  width: 66%;
`;

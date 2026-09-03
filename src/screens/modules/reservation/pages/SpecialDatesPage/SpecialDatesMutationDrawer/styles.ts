import styled, { css } from 'styled-components';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

type ContainerModalProps = {
  loadingHeight?: boolean;
};

export const ContainerModal = styled.div<ContainerModalProps>`
  display: flex;
  justify-content: space-between;

  width: auto;

  ${({ loadingHeight }) =>
    loadingHeight &&
    css`
      height: 70vh;
    `}
`;

export const WrapperTitle = styled.div`
  margin-bottom: 1.25rem;
`;

export const Wrapper = styled.div`
  width: 100%;
  min-height: 55vh;
  max-height: 55vh;
  overflow: auto;
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
`;

export const HourWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ContainerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100%;
`;

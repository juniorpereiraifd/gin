import styled, { css } from 'styled-components';
import { Modal, Radio } from 'antd';

type ContainerListShiftProps = {
  shiftsAmount: number;
};

export const HallsSection = styled.div`
  grid-column: 1;
  grid-row: 2;
`;

export const HallsActionsSection = styled.div`
  grid-column: 2;
  grid-row: 2;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 1.25rem;
`;

export const ButtonsWrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

export const CustomModal = styled(Modal)`
  .ant-modal-body {
    padding: 0 24px 16px 24px;
  }

  .ant-form-item {
    margin-bottom: 0px;
  }

  .ant-modal-content {
    border-radius: 8px;
  }

  .ant-modal-header {
    border-radius: 8px;
    border-bottom: 0;
  }

  .ant-modal-title {
    font-weight: 700;
  }
`;

export const FilterHalls = styled.div`
  display: flex;
  align-items: center;

  p {
    font-size: 14px;
    line-height: 21px;
    margin: 0 0 0 5px;
  }
`;

export const CustomRadioGroup = styled(Radio.Group)`
  width: 100%;

  span {
    padding-right: 0;
  }

  .ant-radio-wrapper {
    margin: 0;
  }
`;

export const CustomRadio = styled(Radio)`
  border: 1px solid #e5e3dc;
  border-radius: 8px;
  padding: 15px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: normal;
  margin-bottom: 10px !important;

  span {
    margin-right: 15px;
    &:nth-child(2n) {
      margin-right: 0px;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
  }

  p {
    margin: 0;
  }

  h5 > span {
    margin-right: 5px;
  }
`;

export const HourWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ShiftInformations = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  span {
    color: #908f8f;
  }
`;

export const ContainerListHall = styled.div`
  width: 100%;
  height: 33.125rem;

  display: flex;

  overflow-y: auto;
  overflow-x: hidden;

  > div {
    width: 100%;
  }

  @media only screen and (min-width: 1441px) {
    height: 40.625rem;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px transparent;
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  .infinite-scroll-component {
    overflow: hidden !important;
  }
`;

export const HallsList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-template-rows: auto;
  gap: 0.625rem;

  @media only screen and (min-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (min-width: 1536px) {
    grid-template-columns: repeat(3, 300px);
  }
`;


export const ContainerListShift = styled.div<ContainerListShiftProps>`
  ${({ shiftsAmount }) => css`
    height: ${shiftsAmount < 3 ? 'auto' : '33rem'};
    margin-bottom: ${shiftsAmount < 3 ? '0' : '1.5rem'};
  `}

  overflow-y: auto;
  overflow-x: hidden;

  padding: 0.625rem;

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px transparent;
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`;

export const WrapperShiftBox = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    max-height: 34.375rem;

    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.white};
    padding: 1rem;

    border: 1px solid ${theme.colors.border};

    > span.box-title {
      color: ${theme.colors.textGrayPrimary};
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.medium};
    }

    p {
      color: ${theme.colors.textGraySecondary};
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const ContainerLoadingShifts = styled.div`
  width: 100%;
  height: 20.625rem;

  margin-bottom: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ListEmptyText = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.875rem;

  ${({ theme }) => css`
    > span {
      color: ${theme.colors.lightSecondary};
      font-size: ${theme.font.sizes.medium};
    }
  `}
`;

import styled, { css } from 'styled-components';
import { Title } from 'src/stories/typography';

export const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;

  margin-bottom: 1.25rem;
`;

export const WrapperForm = styled.div`
  width: 100%;

  border-radius: 6px;
  padding: 1.25rem 1.875rem;

  grid-row-start: 2;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;

export const FormTitle = styled(Title)`
  margin-bottom: 1.25rem;
`;

export const ContentSectionForm = styled.section`
  margin-bottom: 1.875rem;
`;

export const WrapperSwitch = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 1.25rem;

  > div {
    margin: 0;
  }

  > span {
    margin-left: 1rem;
  }
`;

export const WrapperInput = styled.div`
  width: 100%;

  display: flex;
  align-items: center;

  > div {
    min-width: 50%;

    margin-right: 1.875rem;
  }

  > span {
    ${({ theme }) => css`
      color: ${theme.colors.midContrast};
    `}
  }
`;

export const WrapperHour = styled.div`
  display: flex;
  align-items: center;

  > div {
    width: 50%;

    margin-right: 1.875rem;
  }

  > span {
    ${({ theme }) => css`
      color: ${theme.colors.midContrast};
    `}
  }
`;

export const InputHourContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SideMenu = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2rem;

  grid-row-start: 2;
`;

export const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  span.switch-label {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .ant-checkbox-wrapper {
    margin: 0;
  }

  .ant-form-item {
    margin: 0;
  }
`;

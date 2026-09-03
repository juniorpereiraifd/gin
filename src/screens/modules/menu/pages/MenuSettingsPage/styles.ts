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

export const LineField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const WrapperInput = styled.div`
  width: 100%;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  margin-bottom: 1.25rem;

  input[type='color'] {
    width: 6.25rem;
  }

  .ant-form-item {
    margin: 0;
  }

  > span {
    ${({ theme }) => css`
      color: ${theme.colors.midContrast};
    `}
  }
`;

export const WrapperButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FieldWithRemoveButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RemoveFieldIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => css`
    color: ${theme.colors.error};
  `}
`;

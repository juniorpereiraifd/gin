import styled, { css } from 'styled-components';
import { Divider as BaseDivider } from 'antd';
import { Select as CustomSelect } from 'src/stories/entry';

export const FilterSection = styled.section`
  display: flex;
  flex-direction: column;

  gap: 1.25rem;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors['zinc-200']};
    filter: ${theme['drop-shadow'].sm};

    border-radius: ${theme.border.radius.medium};

    padding: 1.25rem;
  `}
`;

export const VisibilityFilterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  ${({ theme }) => css`
    > span.visibility-label {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const VisibilityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  .ant-form-item {
    margin: 0;
  }

  ${({ theme }) => css`
    label.visibility-control-label {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const GeneralFilterContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;

  ${({ theme }) => css`
    > label {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 2;

  ${({ theme }) => css`
    > label {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const Divider = styled(BaseDivider)`
  margin-block: 0.625rem;
`;

export const FieldsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Select = styled(CustomSelect)`
  min-width: 8.125rem;

  ${({ theme }) => css`
    color: ${theme.colors.highContrast};
  `}
`;

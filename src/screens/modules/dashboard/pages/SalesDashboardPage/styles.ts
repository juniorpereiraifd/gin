import styled, { css } from 'styled-components';
import { Title as CustomTitle } from 'src/stories/typography';

type ReportDataProps = {
  blurred: boolean;
};

export const ReportData = styled.div<ReportDataProps>`
  width: 100%;
  height: 100%;

  ${({ blurred }) => css`
    ${blurred === true &&
    css`
      position: relative;
      filter: blur(4px);
      transform: translateZ(1px);
      pointer-events: none;
    `}
  `}
`;

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Title = styled(CustomTitle)`
  margin-bottom: 2rem;
`;

export const FilterSection = styled.section`
  display: flex;
  flex-direction: column;

  gap: 2rem;
`;

export const VisibilityFilterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const VisibilityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;

  .ant-form-item {
    margin: 0;
  }

  span {
    margin-left: 1.5rem;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 50rem;
`;

export const UnauthorizedBox = styled.div`
  padding: 1.5rem 2rem;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.border.radius.medium};
    background-color: ${theme.colors.lightWarning};

    p {
      font-size: ${theme.font.sizes.medium};
      color: ${theme.colors.textGray};
    }
  `}
`;

export const InactiveModuleWarning = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff66;
  filter: blur(4px);
  transform: translateZ(1px);
  pointer-events: none;
`;

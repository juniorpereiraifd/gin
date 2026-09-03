import { List } from 'antd';
import { Question } from 'src/store/modules/nps/reducer';
import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: fit-content;

  border-radius: 6px;
  padding: 2rem 3rem;

  grid-row-start: 2;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
  `}
`;

export const Header = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SubtitleContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Body = styled.section`
  width: 100%;
  height: 50vh;

  margin-top: 2rem;
  border-radius: 4px;

  overflow: auto;

  ${({ theme }) => css`
    background-color: ${theme.colors.grayLight};
  `}

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const FlagLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

export const StyledList = styled(List)<Question>`
  padding: 15px 15px 0px 15px;
`;

export const ContainerListItem = styled.div`
  padding: 1rem 1rem 0.5rem;
`;

export const WrapperTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 1.5rem;

  > span {
    font-size: 1.2rem;

    ${({ theme }) => css`
      color: ${theme.colors.highContrast};
    `}
  }
`;

export const DroppableAreaContainer = styled.div`
  height: 500px;
  overflow: auto;
`;

export const ContainerLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100%;
`;

export const SavinQuestionLoading = styled.div`
  display: flex;
  align-items: center;
  margin-left: 2rem;

  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.highContrast};
  `}
`;

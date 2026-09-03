import styled, { css } from 'styled-components';
import Box from 'src/stories/general/Box';
import { Button } from 'src/stories/general/Button';
import { HallTableProps } from '.';
import { InputNumber as CustomInputNumber } from 'src/stories/entry';

export const Remove = styled(Button)``;

export const Data = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  span {
    margin: 0px 0.4rem;
  }
`;

export const AddWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  span {
    margin: 0px 0.2rem;
  }
`;

export const Wrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.lightGray};
    border-top-right-radius: ${theme.border.radius.large};
    border-top-left-radius: ${theme.border.radius.large};
    border-bottom-right-radius: ${theme.border.radius.large};
    border-bottom-left-radius: ${theme.border.radius.large};

    border: 1px solid ${theme.colors.semiDarkGray};
  `}
`;

export const Icon = styled.img`
  ${({ theme }) => css`
    width: 1.25rem;
    margin-bottom: 0.2rem;
    margin-right: ${theme.spacings.xsmall};
  `}
`;

export const Content = styled.div<HallTableProps>`
  overflow: auto;
  ${({ theme, size }) => css`
    max-height: ${size};
    min-height: ${size};

    padding: ${theme.spacings.xsmall};

    span {
      color: ${theme.colors.secondary};
    }
  `}
`;

export const Header = styled.div`
  ${({ theme }) => css`
    h3 {
      color: ${theme.colors.secondary};
    }
    padding: ${theme.spacings.xsmall};
  `}
`;
export const Footer = styled.div`
  background-color: white;
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.semiDarkGray};
    padding: ${theme.spacings.xsmall};
    border-bottom-right-radius: ${theme.border.radius.large};
    border-bottom-left-radius: ${theme.border.radius.large};
  `}
`;

export const InputNumber = styled(CustomInputNumber)`
  width: 15%;
`;

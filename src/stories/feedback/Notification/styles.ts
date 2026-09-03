import styled, { css } from 'styled-components';
import OriginalTitle from 'src/stories/typography/Title';

export const CloseButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  align-self: start;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.xxxsmall};
  `}
`;

export const Title = styled(OriginalTitle)`
  overflow-wrap: normal;
  word-wrap: break-word;
  hyphens: auto;
  margin: 0;
  max-width: calc(100% - 2.5rem);
`;

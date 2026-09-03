import styled, { css } from 'styled-components';
import { Title as BaseTitle } from 'src/stories/typography';

export const Title = styled(BaseTitle)`
  ${({ theme }) => css`
    color: ${theme.colors.grayTitle};
    font-size: 1.75rem;
  `}
`;

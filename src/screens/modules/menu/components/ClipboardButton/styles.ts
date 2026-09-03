import styled from 'styled-components';

export const Wrapper = styled.button`
  width: 100%;
  min-height: 4.4rem;

  background: ${({ theme }) => theme.colors.white};
  padding: 10px 12.5px;

  border: 1px solid #908f8f;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Content = styled.div`
  width: 90%;

  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #141414;
`;

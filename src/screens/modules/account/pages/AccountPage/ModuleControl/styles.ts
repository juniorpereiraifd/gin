import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
  padding: 1.25rem;
`;

export const FieldsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  margin-top: 3rem;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  svg {
    margin: 0;
  }
`;

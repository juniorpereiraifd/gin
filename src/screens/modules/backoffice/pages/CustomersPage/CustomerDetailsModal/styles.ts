import styled, { css } from 'styled-components';
import { Modal } from 'src/stories/feedback/Modal';
import media from 'styled-media-query';

export const CustomerDetailsModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 100%;
  min-width: 48.2rem;

  .ant-modal-body {
    padding: 3.125rem 1.25rem 1.875rem;
  }

  ${media.lessThan('large')`
    min-width: auto;
  `}
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const Img = styled.img`
  width: 9.7rem;
  height: 9.7rem;

  border-radius: 50%;

  object-fit: cover;
  object-position: center;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  margin-left: 3.6rem;
`;

export const InfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.312rem;

  p {
    margin: 0;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.625rem;

    ${({ theme }) => css`
      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      color: ${theme.colors.highContrast};
    `}
  }
`;

export const Promotions = styled.div`
  margin-top: 4.6rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 1.875rem;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 0.312rem;
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
  `}

  input {
    min-width: 29.1rem;
  }

  button {
    min-width: 11.6rem;
    min-height: 2.5rem;

    ${({ theme }) => css`
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      text-align: center;

      color: ${theme.colors.grayLight};
    `}
  }
`;

export const PromotionList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.625rem;
`;

export const People = styled.div`
  margin-top: 1.875rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 1.25rem;
`;

export const PeopleList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.625rem;
`;

export const PeopleCard = styled.div`
  width: 100%;
  padding: 0.875rem 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  border: 1px solid ${({ theme }) => theme.colors['zinc-200']};
  border-radius: ${({ theme }) => theme.border.radius.normal};

  background-color: ${({ theme }) => theme.colors.white};
`;

export const PeopleMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const PeopleGuests = styled.span`
  ${({ theme }) => css`
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.primary};
  `}
  white-space: nowrap;
`;

export const PeopleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.875rem;

  font-size: ${({ theme }) => theme.font.sizes.small};

  .promotion {
    font-weight: ${({ theme }) => theme.font.normal};
    color: ${({ theme }) => theme.colors.highContrast};
  }

  .date {
    color: ${({ theme }) => theme.colors.grayMedium};
  }

  .status {
    margin-left: auto;
    text-transform: capitalize;

    font-weight: ${({ theme }) => theme.font.bold};

    &.confirmed {
      color: #2e7d32;
    }

    &.pending {
      color: #b26a00;
    }

    &.canceled {
      color: #c62828;
    }
  }
`;

export const History = styled.div`
  margin-top: 1.875rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.625rem;
`;

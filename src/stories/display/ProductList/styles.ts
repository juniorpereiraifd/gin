import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.border.radius.large};
  box-shadow: ${({ theme }) => theme.box.shadow};
  margin-bottom: ${({ theme }) => theme.spacings.xxsmall};
  background-color: ${({ theme }) => theme.colors.white};
  justify-content: space-between;
`;

export const MainContentWrapper = styled.div`
  display: flex;
  padding: 1.5rem 2rem;
  justify-content: space-between;
`;

export const FoooterContentWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacings.xxsmall};
  justify-content: space-between;

  > small {
    color: ${({ theme }) => theme.colors.lightSecondary};
  }
`;

export const NoImageBackground = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.border.radius.normal};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const DragAreaWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    cursor: grabbing;
  }
`;

export const Title = styled.h4`
  font-weight: ${({ theme }) => theme.font.bold};
  font-size: ${({ theme }) => theme.font.sizes.small};
`;

export const StoreRadioWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.lightWarning};
  padding: ${({ theme }) => theme.spacings.xxxsmall};
  border-radius: ${({ theme }) => theme.border.radius.normal};
  align-items: center;
`;

export const DeliveryRadioWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.lightSuccess};
  align-items: center;
  border-radius: ${({ theme }) => theme.border.radius.normal};
  padding: ${({ theme }) => theme.spacings.xxxsmall};
`;

export const ImageAreaWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacings.xxxsmall};
`;

export const PricesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const RightAreaWrapperFooter = styled.div`
  margin-top: 10px;

  span:hover {
    cursor: pointer;
  }
`;

export const LeftItemsWrapper = styled.div`
  display: flex;
`;
export const MiddleTextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: ${({ theme }) => theme.spacings.xsmall};
  align-items: flex-start;

  > small {
    color: ${({ theme }) => theme.colors.black};
  }
`;

export const RightAreaWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

export const ImageBox = styled.div`
  height: 6.25rem;
  width: 6.25rem;
  background: #f6f7f8;
  ${({ theme }) => css`
    border-radius: ${theme.border.radius.normal};
  `}

  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 50rem 8.75rem;
  animation: placeholderShimmer 1s linear infinite forwards;
  img {
    width: 100%;
    height: 100%;
    ${({ theme }) => css`
      border-radius: ${theme.border.radius.normal};
    `}
    object-fit: cover;
  }
  @keyframes placeholderShimmer {
    0% {
      background-position: -40rem 0;
    }
    100% {
      background-position: 15.62rem 0;
    }
  }
`;

export const Icon = styled.img`
  width: 25px;
  height: 25px;
`;

export const DisabledBox = styled.div`
  display: flex;
  padding: 10px;
`;

export const DisabledButton = styled.div`
  border-radius: 4px;
  padding: 3px 5px;
  float: left;
  position: relative;
  margin-right: 5px;
  background: #e8393f;
  color: #ffffff;
`;

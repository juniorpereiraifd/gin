import styled, { css } from 'styled-components';
import { Col, Tabs as CustomTabs, Radio, Skeleton } from 'antd';
import ImageUpload from 'src/stories/entry/ImageUpload';
import { Button } from 'src/stories/general/Button';

const { TabPane } = CustomTabs;

type SmallTextType = {
  noUnderline?: boolean;
  noPointer?: boolean;
};

type EditingType = {
  editing?: boolean | null | undefined;
};

export const HourWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Information = styled.p`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
    margin-top: ${theme.spacings.xsmall};
  `}
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: top;
  .ant-form-item {
    width: 60%;
    ${({ theme }) => css`
      margin-right: ${theme.spacings.medium};
    `}
  }

  ${({ theme }) => css`
    small {
      color: ${theme.colors.lightSecondary};
      font-size: ${theme.font.sizes.small};
      max-width: 35%;
      margin-top: ${theme.spacings.small};
    }
  `}
`;

export const CategoryColumn = styled(Col)`
  display: flex;
  flex-direction: column;
  height: inherit;
`;

export const CategoryConsumptionTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > small {
    color: ${({ theme }) => theme.colors.lightSecondary};
  }
`;

export const EmptyCategoriesMessageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 0.8rem;
  text-align: center;

  > small {
    color: ${({ theme }) => theme.colors.lightSecondary};
  }
`;

export const CustomSkeleton = styled(Skeleton.Input).attrs({
  size: 'large',
})`
  width: 20%;
`;

export const DroppableAreaContainer = styled.div`
  min-height: 500px;
  max-height: 500px;
  overflow: auto;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ProductContainer = styled.div`
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.normal};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border: 2px solid ${({ theme }) => theme.colors.semiDarkGray};
`;

export const ProductContentWrapper = styled.div`
  padding: ${({ theme }) => theme.spacings.xxsmall};
`;

export const PortionNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > div {
    margin-bottom: 0 !important;
  }
  > span {
    margin-bottom: ${({ theme }) => theme.spacings.xxxsmall};
  }
`;

export const MainHeader = styled.div`
  height: ${({ theme }) => theme.spacings.medium};
`;

export const ProductHeader = styled.div`
  border-top-left-radius: ${({ theme }) => theme.border.radius.normal};
  border-top-right-radius: ${({ theme }) => theme.border.radius.normal};
  border-bottom: 2px solid;
  border-bottom-color: ${({ theme }) => theme.colors.lightGray};
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacings.xxsmall};
`;

export const ListItemContentWrapper = styled.div`
  width: 100%;
  padding: 0.625rem 0.625rem;
`;

export const SwitchCategoryWrapper = styled.div`
  overflow: visible;
`;

export const DragIconWrapper = styled.div`
  cursor: grabbing !important;

  ${({ theme }) => css`
    color: ${theme.colors.highContrast};
  `}
`;

export const CategoryTitle = styled.span`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.small};
    font-weight: ${theme.font.bold};
    color: ${theme.colors.highContrast};

    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: ${theme.colors.grayTitle};
    }
  `}
`;

export const CategorySection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CreateCategoryButtonWrapper = styled.div`
  margin-bottom: 1.25rem;
`;

export const CategorySectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  ${({ theme }) => css`
    svg {
      color: ${theme.colors.highContrast};
    }

    > span.category-title {
      font-size: ${theme.font.sizes.medium};
      font-weight: ${theme.font.bold};
      color: ${theme.colors.highContrast};
    }
  `}
`;

export const SmallText = styled.small<SmallTextType>`
  ${({ theme, noUnderline, noPointer }) => css`
    cursor: ${noPointer ? 'default' : 'pointer'};
    text-decoration: ${noUnderline ? null : 'underline'};
    font-size: ${theme.font.sizes.small};
    color: ${theme.colors.lightSecondary};
  `}
`;

export const ListItemContentBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const LeftCategoryItems = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const CategoriesWrapper = styled.div``;

export const ActionContainer = styled.div`
  width: 100%;
`;

export const SkeletonWrapper = styled.div`
  height: 44px;
`;

export const TimeWrapper = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;

  ${({ theme }) => css`
    small {
      color: ${theme.colors.lightSecondary};
      font-size: ${theme.font.sizes.small};
      max-width: 35%;
      margin-top: ${theme.spacings.small};
    }
  `}
`;

export const InputWrapperDuo = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  .ant-form-item {
    width: 49%;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const NotificationWrapper = styled.div`
  display: flex;
`;

export const EmailsWrapper = styled.div`
  width: 100%;
`;

export const Main = styled(Col)`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacings.medium};
  `}
`;

export const Pane = styled(TabPane)`
  ${({ theme }) => css`
    border-radius: ${theme.border.radius.large};
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.white};
    padding: ${theme.spacings.xsmall} ${theme.spacings.xsmall};
  `};
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CustomRadioGroup = styled(Radio.Group)`
  width: 100%;

  span {
    padding-right: 0;
  }

  .ant-radio-wrapper {
    margin: 0;
  }
`;

export const NoProductsWrapper = styled.div`
  color: ${({ theme }) => theme.colors.darkGray};
`;

export const CategoryModalWrapper = styled.div`
  margin-top: 1.25rem;
  display: flex;
`;

export const PickerWrapper = styled.div`
  justify-content: center;
  display: flex;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProductColumnWrapper = styled.div`
  margin-left: 15px;
  height: 100%;
`;

export const LoadProductsContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListProductsWrapper = styled.div`
  width: 100%;
  min-width: 370px;
  height: 94%;
  border-color: ${({ theme }) => theme.colors.darkGray};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.border.radius.normal};
  padding: ${({ theme }) => theme.spacings.xxxsmall};
  overflow-y: auto;
  max-height: 374px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ProductListItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  box-shadow: ${({ theme }) => theme.box.shadow};
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacings.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacings.xxxsmall};
  border-radius: ${({ theme }) => theme.border.radius.normal};
`;

export const AddNewProductModalWrapper = styled.div`
  min-width: 520px;
`;

export const ProductImageUpload = styled(ImageUpload)`
  .ant-upload {
    height: 200px;
    margin: 0;
  }
  min-width: 200px;
`;

export const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 1.25rem;
`;

export const InputWrapperProduct = styled.div`
  display: flex;
  align-items: center;

  .ant-form-item-label {
    margin-top: 10px;
    padding-bottom: 12px;
    width: 430px;
  }
`;

export const DescriptionInputWrapper = styled.div`
  .ant-form-item-label {
    margin-top: 10px;
    padding-bottom: 12px;
    width: 530px;
  }
`;

export const SelectsWrapper = styled.div`
  display: flex;
`;

export const PriceInputWrapper = styled.div`
  margin-left: 15px;
`;

export const FormWrapperProduct = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SelectWrapper = styled.div``;

export const FormColum = styled(Col)`
  padding: 0 !important;
`;

export const ProductActionButtonsWrapper = styled.div`
  margin-top: 1.875rem;
`;

export const LoadingProductContainer = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
`;

export const OptionalsContainer = styled.div`
  width: 100%;
  max-height: 550px;
  border-radius: ${({ theme }) => theme.border.radius.normal};
  margin-top: ${({ theme }) => theme.spacings.xsmall};
  background-color: ${({ theme }) => theme.colors.lightGray};
  padding: ${({ theme }) => theme.spacings.xxsmall};
  border: 2px solid ${({ theme }) => theme.colors.lightGray};

  overflow: auto;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const OptionalsListItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.box.shadow};
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacings.xsmall};
  border-radius: ${({ theme }) => theme.border.radius.normal};
`;

export const PencilWrapper = styled.div`
  cursor: pointer;
`;

export const CustomTitle = styled.h3`
  color: ${({ color }) => color};
  line-height: 20px;
  font-weight: ${({ theme }) => theme.font.bold};
  font-size: ${({ theme }) => theme.font.sizes.large};
`;

export const CustomSkeletonOptionals = styled(Skeleton.Input)`
  height: 60px;
  width: 100%;
`;

export const SmallWrapper = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
`;

export const SelectProductsWrapper = styled.div`
  margin-top: 1rem;

  max-width: 736px;
  .ant-select-selector {
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none;
    }

    padding: 5px;
    height: 100% !important;
    align-items: flex-start !important;
  }
`;

export const MultipleOptionalsWrapper = styled.div`
  width: 100%;
  max-height: 250px;
  border-top-right-radius: ${({ theme }) => theme.border.radius.normal};
  border-top-left-radius: ${({ theme }) => theme.border.radius.normal};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border: 1px solid ${({ theme }) => theme.colors.semiDarkGray};
  padding: ${({ theme }) => theme.spacings.xxsmall};

  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StoreIconWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.lightWarning};
  padding: ${({ theme }) => theme.spacings.xxxsmall};
  border-radius: ${({ theme }) => theme.border.radius.normal};
  border: 1px solid ${({ theme }) => theme.colors.darkWarning};
  align-items: center;
`;

export const DeliveryIconWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.lightSuccess};
  align-items: center;
  border-radius: ${({ theme }) => theme.border.radius.normal};
  border: 1px solid ${({ theme }) => theme.colors.darkSuccess};
  padding: ${({ theme }) => theme.spacings.xxxsmall};
`;

export const OptionalCardWrapper = styled.div<EditingType>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.box.shadow};
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacings.xsmall};
  border-radius: ${({ theme }) => theme.border.radius.normal};
  margin-bottom: ${({ theme }) => theme.spacings.xsmall};

  opacity: ${({ editing }) => (editing ? '0.5' : '1')};
  pointer-events: ${({ editing }) => (editing ? 'none' : 'auto')};
`;

export const Icon = styled.img`
  width: 25px;
  height: 25px;
`;

export const Remove = styled(Button)`
`;

export const AddOptional = styled(Button)`
`;

export const NewOptionalWrapper = styled.div<EditingType>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme, editing }) => {
    return editing ? theme.colors.warning : theme.colors.white;
  }};
  padding: ${({ theme }) => theme.spacings.xsmall};
  border-bottom-left-radius: ${({ theme }) => theme.border.radius.normal};
  border-bottom-right-radius: ${({ theme }) => theme.border.radius.normal};
  border: 1px solid ${({ theme }) => theme.colors.semiDarkGray};
  margin-bottom: ${({ theme }) => theme.spacings.xsmall};

  > div.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const NameOptionalInputWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }
`;

export const PriceOptionalInputWrapper = styled.div`
  padding: 16px;

  .ant-form-item {
    margin-bottom: 0;
  }
`;

export const ConsumptionTypePickerWrapper = styled.div`
  padding: 16px;
`;

export const CustomInputNumber = styled.div`
  .ant-input-number-handler-wrap {
    display: none;
  }

  .ant-form-item-explain {
    > div {
      width: max-content;
      position: absolute;
    }
  }
`;

export const DragIconWrapperOptionals = styled.div`
  cursor: grabbing !important;
`;

export const TabListContentEditOptional = styled.div`
  [role='tablist'] {
    .ant-tabs-tab-active {
      background-color: ${({ theme }) => theme.colors.warning} !important;
    }
  }

  [role='tabpanel'] {
    background-color: ${({ theme }) => theme.colors.warning};

    border: 0;
  }
`;

export const OptionsTitleWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const PaneProductForm = styled(TabPane)`
  padding-top: 2rem;
`;

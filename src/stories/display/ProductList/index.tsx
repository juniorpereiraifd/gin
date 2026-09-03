/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Trash } from '@styled-icons/bootstrap/Trash';
import { Pencil } from '@styled-icons/heroicons-outline/Pencil';
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import { Col, Switch, Typography } from 'antd';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { Creators as ProductCreators } from 'src/store/modules/product/actions';
import type { ProductItemProps } from 'src/store/modules/product/reducer';
import Title from 'src/stories/typography/Title';
import Space from 'src/stories/utils/Space';
import * as S from './styles';
import { getCurrencyBrl } from 'src/utils/helpers';

type ListProductItemProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  // eslint-disable-next-line
  innerRef?: any;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  noActions?: boolean;
  title?: string;
  optionals?: number;
  price?: number;
  description?: string;
  imageUrl?: string;
  product?: ProductItemProps;
};

const { Paragraph } = Typography;

type ActiveProps = {
  category_item_id?: string | number;
  active: boolean;
};

const ProductList = ({
  onEdit,
  onDelete,
  innerRef,
  title,
  description,
  price,
  imageUrl,
  dragHandleProps,
  product,
  ...props
}: ListProductItemProps) => {
  const dispatch = useDispatch();

  const handleActiveProduct = (value: boolean) => {
    //@ts-ignore

    const newActiveStatus: ActiveProps = {
      category_item_id: product?.id,
      active: value,
    };

    dispatch(ProductCreators.changeActiveStatus(newActiveStatus));
  };

  return (
    <S.Wrapper ref={innerRef} {...props}>
      <S.MainContentWrapper>
        <Col span={18}>
          <S.LeftItemsWrapper style={{ display: 'flex' }}>
            <S.DragAreaWrapper>
              <span {...dragHandleProps}>
                <DragIndicator size={25} />
              </span>
            </S.DragAreaWrapper>
            <S.ImageAreaWrapper>
              <S.ImageBox>
                {imageUrl && <img src={imageUrl} alt="Imagem do produto." />}
                {!imageUrl && <S.NoImageBackground />}
              </S.ImageBox>
            </S.ImageAreaWrapper>
            <S.MiddleTextAreaWrapper>
              <Title level={5}>{title}</Title>
              <Paragraph style={{ color: '#808080' }}>{description}</Paragraph>
            </S.MiddleTextAreaWrapper>
          </S.LeftItemsWrapper>
        </Col>

        <Col span={3}>
          <S.RightAreaWrapper>
            <S.PricesWrapper>
              {price !== undefined && (
                <Title level={4}>{getCurrencyBrl(price)}</Title>
              )}
            </S.PricesWrapper>
            <S.RightAreaWrapperFooter>
              <Space size={10} direction="horizontal">
                <span>
                  <Pencil onClick={onEdit} size={25} />
                </span>
                <span>
                  <Trash onClick={onDelete} size={25} />
                </span>
                <Switch
                  checked={product?.active}
                  onChange={(e) => handleActiveProduct(e)}
                />
              </Space>
            </S.RightAreaWrapperFooter>
          </S.RightAreaWrapper>
        </Col>
      </S.MainContentWrapper>
    </S.Wrapper>
  );
};

export default ProductList;

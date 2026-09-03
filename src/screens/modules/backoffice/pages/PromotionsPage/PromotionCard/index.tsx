import { Popconfirm, Skeleton, Switch } from 'antd';
import dayjs from 'dayjs';
import { HTMLAttributes, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { PromotionData } from 'src/store/modules/promotions/reducer';
import { Title } from 'src/stories/typography';
import * as S from './styles';

type Status = 'active' | 'inactive';

interface PromotionCardProps extends HTMLAttributes<HTMLDivElement> {
  withLoading?: boolean;
  promotion?: PromotionData;
  handleOpenEditModal?: () => void;
}

export function PromotionCard({
  withLoading = false,
  promotion,
  handleOpenEditModal,
  ...props
}: PromotionCardProps) {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState<Status>(promotion?.status as Status);
  const iconProps = {
    size: 20,
    disabled: !checked,
  };

  const deletePromotion = () =>
    dispatch(
      PromotionCreators.deletePromotionRequest({
        promotionId: promotion?.id as string,
      })
    );

  const handlePromotionStatus = (value: Status) => {
    if (promotion?.id) {
      setChecked(value);
      dispatch(
        PromotionCreators.editPromotionRequest({
          promotion: { id: promotion.id, status: value },
          promotionType: promotion?.redirect_url ? 'external-link' : 'get-in',
        })
      );
    }
  };

  return (
    <>
      <S.PromotionCard
        isActive={checked === 'active'}
        withLoading={withLoading}
        {...props}
      >
        {withLoading ? (
          <Skeleton avatar active />
        ) : (
          <>
            <img
              src={promotion?.banner}
              title={promotion?.title}
              alt={promotion?.title}
            />

            <S.DescriptionWrapper>
              <S.Description onClick={(e) => e?.stopPropagation()}>
                <Title level={3}>{promotion?.title}</Title>

                <S.Label variant="secondary">
                  De {dayjs(promotion?.start_at).format('DD/MM')} a{' '}
                  {dayjs(promotion?.end_at).format('DD/MM')}
                </S.Label>
              </S.Description>

              <S.ButtonsWrapper onClick={(e) => e?.stopPropagation()}>
                <S.EditIcon
                  {...iconProps}
                  title="Editar"
                  onClick={handleOpenEditModal}
                />

                <Popconfirm
                  title="Tem certeza de que deseja excluir esta promoção?"
                  okText="Confirmar"
                  cancelText="Cancelar"
                  onConfirm={deletePromotion}
                  placement="left"
                  disabled={!checked}
                >
                  <S.TrashIcon {...iconProps} title="Excluir" />
                </Popconfirm>

                <Switch
                  title={
                    promotion?.status === 'active' ? 'Desativar' : 'Ativar'
                  }
                  checked={checked === 'active'}
                  onChange={(value: boolean) =>
                    handlePromotionStatus(value ? 'active' : 'inactive')
                  }
                />
              </S.ButtonsWrapper>
            </S.DescriptionWrapper>
          </>
        )}
      </S.PromotionCard>
    </>
  );
}

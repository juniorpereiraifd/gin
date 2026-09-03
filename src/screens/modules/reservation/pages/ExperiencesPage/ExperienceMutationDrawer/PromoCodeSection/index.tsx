import { Dispatch, Fragment, FunctionComponent, SetStateAction } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import { useDispatch } from 'react-redux';
import { Creators as BookingExperiencesCreators } from 'src/store/modules/bookingExperiences/actions';
import { PromoCode } from 'src/store/modules/bookingExperiences/reducer';
import { PlusLg } from '@styled-icons/bootstrap/PlusLg';
import { Infinite } from '@styled-icons/boxicons-regular/Infinite';
import { Trash } from '@styled-icons/bootstrap/Trash';
import { Button } from 'src/stories/general/Button';
import { PromoCodeWriteModal } from './PromoCodeWriteModal';
import * as S from './styles';
import Delete from 'src/components/Delete';
import dayjs from 'dayjs';
import { Heading } from 'src/ui/Typograph';

type PromoCodeSectionProps = {
  form: FormInstance<any>;
  isOpenPromoCodeModal: boolean;
  setIsOpenPromoCodeModal: Dispatch<SetStateAction<boolean>>;
};

export const PromoCodeSection: FunctionComponent<PromoCodeSectionProps> = ({
  form,
  isOpenPromoCodeModal,
  setIsOpenPromoCodeModal,
}) => {
  const dispatch = useDispatch();

  const handleClickPromoCode = (promoCode: PromoCode) => {
    dispatch(BookingExperiencesCreators.setEditablePromoCode(promoCode));
    setIsOpenPromoCodeModal(true);
  };

  const hideWritePromoCodeModal = () => {
    dispatch(BookingExperiencesCreators.setEditablePromoCode(null));
    setIsOpenPromoCodeModal(false);
  };

  const handleRemovePromoCode = (promoCode: PromoCode) => {
    const promoCodes = form.getFieldValue('promo_codes') || [];

    form.setFieldsValue({
      promo_codes: promoCodes.filter((c: PromoCode) => c.code !== promoCode.code),
    });
  };

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4">
        <Heading level="4" className="text-base">
          Códigos Promocionais
        </Heading>
        <Button
          htmlType="button"
          variant="outlined"
          onClick={() => setIsOpenPromoCodeModal(true)}
          icon={<PlusLg size={12} />}
        >
          Adicionar código
        </Button>
      </div>
      <Form.Item name="promo_codes" noStyle />
      <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.promo_codes !== curValues.promo_codes}>
        {({ getFieldValue }) => {
          const promoCodes: PromoCode[] = getFieldValue('promo_codes') || [];

          return promoCodes.length ? (
            <ul className="grid grid-cols-2 gap-4 py-4">
              {promoCodes.map((promoCode) => (
                <li
                  className="w-full flex overflow-hidden bg-white border border-gray-300 rounded-md shadow-sm transition-all hover:shadow-md"
                  key={promoCode.code}
                >
                  <button
                    type="button"
                    className="flex flex-col p-2 gap-2"
                    onClick={() => handleClickPromoCode(promoCode)}
                  >
                    <span className="text-sm text-slate-700 font-medium w-fit">{promoCode.code}</span>
                    <div className="w-full flex items-center justify-between">
                      <span className="bg-blue-50 border border-blue-500 py-1 px-2 rounded-2xl text-xs text-blue-500 font-semibold">
                        {promoCode.discount}%
                      </span>
                      {promoCode.quantity !== undefined ? (
                        <span className="text-xs text-slate-600">x{promoCode.quantity}</span>
                      ) : (
                        <Infinite size={16} className="text-slate-500" />
                      )}
                    </div>
                    <div className="w-full flex items-baseline text-left text-xs text-slate-500">
                      {promoCode.starting_at !== undefined || promoCode.ending_at !== undefined ? (
                        <span className="date">{getDateCopy(promoCode.starting_at, promoCode.ending_at)}</span>
                      ) : (
                        <span className="date">Não expira</span>
                      )}
                    </div>
                  </button>
                  <S.PromoCodeActions>
                    <S.DeletePromoCodeButton type="button">
                      <Delete onDelete={() => handleRemovePromoCode(promoCode)} className="delete-trigger">
                        <Trash size={16} />
                      </Delete>
                    </S.DeletePromoCodeButton>
                  </S.PromoCodeActions>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 w-full text-center my-6">Nenhum código promocional cadastrado</p>
          );
        }}
      </Form.Item>
      <PromoCodeWriteModal open={isOpenPromoCodeModal} onCancel={hideWritePromoCodeModal} />
    </Fragment>
  );
};

const getDateCopy = (startDate: string | undefined, endDate: string | undefined) => {
  const startDateFormatted = startDate !== undefined ? dayjs(startDate).format('DD/MM/YYYY') : null;
  const endDateFormatted = endDate !== undefined ? dayjs(endDate).format('DD/MM/YYYY') : null;

  if (startDateFormatted && endDateFormatted) {
    return `A partir de ${startDateFormatted} até ${endDateFormatted}`;
  }

  if (startDateFormatted && !endDateFormatted) {
    return `A partir de ${startDateFormatted}`;
  }

  if (!startDateFormatted && endDateFormatted) {
    return `Até ${endDateFormatted}`;
  }
};

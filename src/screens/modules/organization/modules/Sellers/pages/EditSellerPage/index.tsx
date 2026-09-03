import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Steps } from 'antd';
import { PaymentCreators } from 'src/store/modules/payment/actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { DocumentsSection } from '../../components/DocumentsSection';
import { InformationSection } from '../../components/InformationSection';
import type { RootType } from 'src/store/modules/rootReducer';

export const EditSellerPage = () => {
  const { sellerId } = useParams<'seller'>();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {
    payment: { loadingSeller, selectedSeller },
  } = useSelector((state: RootType) => state);
  const tabParam = searchParams.get('tab');
  const initialStep = tabParam === 'documents' ? 1 : 0;
  const [current, setCurrent] = useState(initialStep);

  const steps = {
    0: <InformationSection loading={loadingSeller} editable={selectedSeller || undefined} />,
    1: <DocumentsSection loading={loadingSeller} editable={selectedSeller || undefined} />,
  };

  useEffect(() => {
    if ((sellerId || null) !== null) {
      dispatch(PaymentCreators.getSellerRequest({ sellerId }));
    }
  }, [sellerId]);

  useEffect(() => {
    if (selectedSeller && selectedSeller.unit_id) {
      dispatch(HallCreators.getUnityRequest({ id: selectedSeller.unit_id }));
    }
  }, [selectedSeller]);

  return (
    <PageContainer className="pb-8">
      <PageTitle>Editar vendedor</PageTitle>
      <Steps
        className="my-8"
        current={current}
        onChange={setCurrent}
        labelPlacement="vertical"
        size="small"
        items={[
          {
            title: 'Informações cadastrais',
          },
          {
            title: 'Documentos',
            disabled: loadingSeller || !selectedSeller,
          },
        ]}
      />
      <div className="mt-8">{steps[current as keyof typeof steps]}</div>
    </PageContainer>
  );
};

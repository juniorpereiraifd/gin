import { useState } from 'react';
import { Steps } from 'antd';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { InformationSection } from '../../components/InformationSection';

export const CreateSellerPage = () => {
  const [current, setCurrent] = useState(0);

  return (
    <PageContainer className="pb-8">
      <PageTitle>Criar vendedor</PageTitle>
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
            disabled: true,
          },
        ]}
      />
      <div className="mt-8">{current === 0 && <InformationSection />}</div>
    </PageContainer>
  );
};

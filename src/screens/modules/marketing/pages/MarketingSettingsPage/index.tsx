import { FunctionComponent, useEffect, useState } from 'react';
import { Divider, Input } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { Button } from 'src/stories/general/Button';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { PageContainer } from 'src/components/PageContainer';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { PageTitle } from 'src/stories/typography/PageTitle';

type MarketingSettingsFormValues = {
  sms_franchise: number;
};

export const MarketingSettingsPage: FunctionComponent = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    hall: { unity },
    marketing: { settings, savingSettings },
  } = useSelector((state: RootType) => state);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (unity !== null) {
      dispatch(MarketingCreators.getMarketingSettingsRequest());
    }
  }, [unity]);

  useEffect(() => {
    if (settings !== null) {
      form.setFieldsValue({
        sms_franchise: settings.sms_franchise,
      });
    }
  }, [settings]);

  const handleFinish = (values: MarketingSettingsFormValues) => {
    dispatch(
      MarketingCreators.updateMarketingSettingsRequest({
        ...values,
        sms_franchise: Number(values.sms_franchise ?? 0),
      })
    );
  };

  return (
    <PageContainer sideColumn>
      <PageTitle>Ajustes de Marketing</PageTitle>
      <BoxContrasted className="col-start-1 row-start-2">
        <Form layout="vertical" form={form} onFinish={handleFinish} onChange={() => setDisabled(false)}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FormItem className="col-span-3" label="Franquia de SMS" name="sms_franchise" rules={rules.sms_franchise}>
              <Input type="number" />
            </FormItem>
          </div>
          <Divider />
          <div className="flex items-center justify-end">
            <Button disabled={disabled} loading={savingSettings} onClick={form.submit}>
              Salvar alterações
            </Button>
          </div>
        </Form>
      </BoxContrasted>
    </PageContainer>
  );
};

const rules = {
  sms_franchise: [
    {
      required: true,
      message: 'A franquia de SMS é obrigatória.',
    },
    (): RuleObject => ({
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }

        if (value < 0) {
          return Promise.reject('Informe um valor igual ou acima de 0.');
        }

        return Promise.resolve();
      },
    }),
  ],
};

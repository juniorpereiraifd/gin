import { Fragment, FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Input, Popover } from 'antd';
import { Download, Info } from 'lucide-react';
import { Creators as WidgetCreators } from 'src/store/modules/widget/actions';
import { Button } from 'src/stories/general/Button';
import { WidgetProps } from 'src/store/modules/widget/reducer';
import { ContentCopy } from 'styled-icons/material-outlined';
import { notification } from 'src/utils/helpers';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Heading } from 'src/ui/Typograph';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import type { RootType } from 'src/store/modules/rootReducer';

type IntegrationSectionProps = {
  selectedWidget: WidgetProps | null;
};

export const IntegrationSection: FunctionComponent<IntegrationSectionProps> = (props) => {
  const { selectedWidget } = props;
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    widget: { savingWidgetCodes },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (selectedWidget)
      form.setFieldsValue({
        gtm: selectedWidget.gtm_code ? selectedWidget.gtm_code : '',
        fb_pixel: selectedWidget.fb_pixel_code ? selectedWidget.fb_pixel_code : '',
      });
  }, [selectedWidget, form]);

  const handleCopyTag = async () => {
    try {
      await navigator.clipboard.writeText(selectedWidget?.tag as string);
      notification.success('Sucesso', 'O código do widget foi copiado com sucesso!');
    } catch (error) {
      notification.error('Houve um erro ao copiar o código', 'Atualize a página e tente novamente!');
    }
  };

  const handleFinish = (values: { gtm: string; fb_pixel: string }) => {
    if (selectedWidget) {
      dispatch(
        WidgetCreators.saveGtmAndFbPixelCodesWidgetRequest({
          widget: selectedWidget,
          gtm_code: values.gtm,
          fb_pixel_code: values.fb_pixel,
        })
      );
    }
  };

  return (
    <BoxContrasted>
      <Heading level="5">Integração para websites</Heading>
      <div className="flex flex-col gap-3 mt-6">
        <Heading level="6">Etapa 1</Heading>
        <p className="text-sm text-slate-600">
          Faça download do PDF do manual de integração do widget de reservas. Nele você também encontra o passo a passo
          para customizar o botão.
        </p>
        <Button
          className="w-fit self-end"
          icon={<Download size={14} />}
          onClick={() => window.open('https://cdn.getinapp.com.br/docs/manual-widget.pdf', '__blank')}
        >
          Baixar manual de integração
        </Button>
      </div>
      <div className="flex flex-col gap-3 mt-6">
        <Heading level="6">Etapa 2</Heading>
        <p className="text-sm text-slate-600">
          Copie o código e insira o script do widget de reservas no seu site logo antes do fechamento da tag {'</body>'}
          .
        </p>
        <div className="border border-gray-300 rounded-sm overflow-auto">
          <pre className="p-4 m-0 text-sm bg-gray-50">
            <code className="text-red-600 whitespace-pre-wrap break-all">{selectedWidget?.tag}</code>
          </pre>
        </div>
        <Button className="w-fit self-end" icon={<ContentCopy size={15} />} onClick={handleCopyTag}>
          Copiar
        </Button>
      </div>
      <Divider />
      <Heading level="5">Integração com Google e Facebook ADS</Heading>
      <p className="text-sm text-slate-600 mt-2">
        {(selectedWidget?.default ?? false) === true ? (
          <Fragment>
            O Widget Padrão não suporta integração com o Google Tag Manager (GTM) e o Facebook Ads, sendo exclusivo para
            os canais GetIn. <b>Caso deseje realizar essa integração, crie um novo widget.</b>
          </Fragment>
        ) : (
          'Adicione abaixo os códigos para integração de campanhas com Facebook Pixel e Google Analytics.'
        )}
      </p>
      {(selectedWidget?.default ?? false) === false && (
        <Fragment>
          <Form form={form} onFinish={handleFinish} layout="vertical" className="grid grid-cols-2 gap-4 mt-6">
            <FormItem name="gtm" label="Código Google GTM">
              <Input placeholder="000000" type="text" />
            </FormItem>
            <FormItem
              name="fb_pixel"
              label={
                <div className="flex items-center gap-2">
                  <span>Código Facebook Pixel</span>
                  <Popover
                    content={
                      <div className="flex flex-col gap-2">
                        <span className="text-slate-800 font-medium">Código de Identificação</span>
                        <p className="text-xs text-slate-600">
                          Inclua o código de identificação do pixel conforme o exemplo abaixo.
                        </p>
                        <img src="/assets/facebook-pixel-example.svg" alt="facebook-pixel-example-img" />
                      </div>
                    }
                  >
                    <Info size={14} />
                  </Popover>
                </div>
              }
            >
              <Input placeholder="0000000000" type="text" />
            </FormItem>
          </Form>
          <div className="flex items-center justify-end">
            <Button onClick={form.submit} loading={savingWidgetCodes}>
              Salvar
            </Button>
          </div>
        </Fragment>
      )}
    </BoxContrasted>
  );
};

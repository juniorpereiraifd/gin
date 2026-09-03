import { Checkbox, DatePicker, Input, Switch } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, useEffect, useRef } from 'react';
import { FormItem, InputNumber, TextArea } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Paragraph, Title } from 'src/stories/typography';
import type { Base64 } from 'src/types';
import type { CurrentStepProps, StepProps } from '.';
import * as S from './styles';

export function Step1({
  promotion,
  handleChangePromotion,
  promotionType,
}: StepProps) {
  const step: CurrentStepProps = '1';

  const currentDate = dayjs().format('DD/MM/YYYY');
  const currentDateOnNextMonth = dayjs().add(1, 'M').format('DD/MM/YYYY');

  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const today = Date.now();

  const checkForDisablingStartDate = (date: Dayjs) => {
    if (date.isBefore(today)) {
      return true;
    }
    if (promotion.endDate) {
      return date.isAfter(promotion.endDate);
    }
    return false;
  };

  const checkForDisablingEndDate = (date: Dayjs) => {
    if (date.isBefore(today)) {
      return true;
    }
    if (promotion.startDate) {
      return date.isBefore(promotion.startDate);
    }
    return false;
  };

  const hasAllRequiredValuesForShowPreView =
    !!promotion.title && !!promotion.message && !!promotion.banner?.content;

  const bannerContent = (
    <S.SeparatorWrapper title="Inserir Banner">
      <Title level={4}>Inserir Banner</Title>

      <S.InputBanner onClick={() => bannerInputRef?.current?.click()}>
        <div>Enviar</div>
        <span>{promotion.banner?.name ?? 'Selecione o arquivo.'}</span>
      </S.InputBanner>

      <input
        type="file"
        accept="image/png, image/jpeg, image/svg+xml, image/gif"
        hidden
        ref={bannerInputRef}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e?.target?.files) {
            const targetFile = e?.target?.files[0];
            if (targetFile) {
              const reader = new FileReader();
              reader.readAsDataURL(targetFile);
              reader.onload = () =>
                handleChangePromotion('banner', {
                  name: targetFile.name,
                  content: reader.result as Base64,
                });
              reader.onerror = () => handleChangePromotion('banner', null);
            }
          }
        }}
      />

      <S.FileDescription>
        Tamanho da imagem: de 345px até 178px. <br />
        Arquivos suportados: jpeg, png, svg ou gif.
      </S.FileDescription>
    </S.SeparatorWrapper>
  );

  const isGetInPromotion = promotionType === 'get-in';
  const isExternalPromotion = promotionType === 'external-link';

  useEffect(() => {
    if (isGetInPromotion) handleChangePromotion('restriction', 'one');
  }, [promotionType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <S.ContentWrapper promotionType={promotionType} step={step}>
      <S.LeftContent>
        <Title level={4}>Mecânica da Promoção</Title>

        <FormItem label="Título" required minHeight="4rem">
          <Input
            value={promotion.title}
            onChange={({ target: { value } }) =>
              handleChangePromotion('title', value)
            }
          />
        </FormItem>

        <S.DatesWrapper>
          <FormItem label="Data de início" required minHeight="4rem">
            <DatePicker
              placeholder={`Ex: ${currentDate}`}
              format="DD/MM/YYYY"
              disabledDate={(date) => checkForDisablingStartDate(date)}
              value={promotion.startDate}
              onChange={(value) => handleChangePromotion('startDate', value)}
            />
          </FormItem>

          <FormItem label="Data de término" required minHeight="4rem">
            <DatePicker
              placeholder={`Ex: ${currentDateOnNextMonth}`}
              format="DD/MM/YYYY"
              disabledDate={(date) => checkForDisablingEndDate(date)}
              value={promotion.endDate}
              onChange={(value) => handleChangePromotion('endDate', value)}
            />
          </FormItem>
        </S.DatesWrapper>

        <FormItem label="Mensagem da promoção" required>
          <TextArea
            rows={4}
            maxLength={280}
            placeholder="Ex: Se cadastre no nosso app e ganhe uma sobremesa grátis!"
            value={promotion.message}
            onChange={({ target: { value } }) =>
              handleChangePromotion('message', value)
            }
          />
        </FormItem>

        {isGetInPromotion && (
          <>
            <FormItem
              rowDirection
              label="Permitir que o cliente se cadastre mais de uma vez"
              labelPosition="right"
              onClickOnLabel={() =>
                handleChangePromotion(
                  'restriction',
                  promotion.restriction === 'one' ? 'unlimited' : 'one'
                )
              }
            >
              <Checkbox
                checked={promotion.restriction === 'unlimited'}
                onChange={({ target: { checked } }) =>
                  handleChangePromotion(
                    'restriction',
                    checked ? 'unlimited' : 'one'
                  )
                }
              />
            </FormItem>

            <S.DiscountFormItem label="Definir desconto" minHeight="4rem">
              <div>
                <InputNumber
                  type="number"
                  min={10}
                  max={100}
                  placeholder="de 10 a 100"
                  value={promotion.discount}
                  onChange={(value) => handleChangePromotion('discount', value)}
                />
                <strong className="percent">%</strong>
              </div>
            </S.DiscountFormItem>
          </>
        )}

        <S.CustomDivider withoutMargin />

        {isExternalPromotion && (
          <>
            <S.ItensWrapper>
              <span>
                *&nbsp;
                <Title level={4}>Link da promoção</Title>
              </span>

              <div>
                <Title level={6}>Adicione o link da promoção</Title>

                <FormItem title="Link da promoção" minHeight="4rem">
                  <Input
                    placeholder="Ex: www.getinapp.com.br/promo"
                    value={promotion.redirectUrl!}
                    onChange={({ target: { value } }) =>
                      handleChangePromotion('redirectUrl', value)
                    }
                  />
                </FormItem>
              </div>
            </S.ItensWrapper>

            {bannerContent}
          </>
        )}

        {isGetInPromotion && (
          <>
            <S.ItensWrapper>
              <Title level={4}>Item da promoção</Title>

              <div>
                <Title level={6}>Adicione um item que queira promover</Title>

                <FormItem title="Item da promoção" minHeight="4rem">
                  <Input
                    placeholder="Ex: Stella"
                    value={promotion.item}
                    onChange={({ target: { value } }) =>
                      handleChangePromotion('item', value)
                    }
                  />
                </FormItem>
              </div>
            </S.ItensWrapper>

            <S.CustomDivider withoutMargin />
          </>
        )}

        <S.StatusPromotionWrapper title="Status">
          <Switch
            title="Ativar/Inativar"
            checked={promotion.status === 'active'}
            onChange={(value: boolean) =>
              handleChangePromotion('status', value ? 'active' : 'inactive')
            }
          />

          <Title level={4}>
            Promoção {promotion.status === 'active' ? 'ativa' : 'inativa'}
          </Title>
        </S.StatusPromotionWrapper>
      </S.LeftContent>

      {isGetInPromotion && (
        <S.RightContent step={step}>
          {bannerContent}

          {hasAllRequiredValuesForShowPreView && (
            <>
              <S.CustomDivider withoutMargin />

              <S.PreVisualization>
                <Title level={4}>Pré visualização</Title>

                <S.PreviewBox>
                  <S.PreviewDetails>
                    <Title level={4}>{promotion.title}</Title>
                    <Paragraph>{promotion.message}</Paragraph>

                    <Button>Ganhar {promotion.item || 'agora'}</Button>
                  </S.PreviewDetails>

                  <S.PreviewImageWrapper>
                    <img
                      src={promotion.banner?.content}
                      alt={promotion.title}
                    />
                  </S.PreviewImageWrapper>
                </S.PreviewBox>
              </S.PreVisualization>
            </>
          )}
        </S.RightContent>
      )}
    </S.ContentWrapper>
  );
}

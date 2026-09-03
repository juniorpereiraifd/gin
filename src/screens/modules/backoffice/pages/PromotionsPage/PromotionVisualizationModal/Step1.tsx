import { Checkbox, DatePicker, Input, Switch } from 'antd';
import dayjs from 'dayjs';
import { FormItem, InputNumber, TextArea } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Paragraph, Title } from 'src/stories/typography';
import type { CurrentStepProps, StepProps } from '.';
import * as S from './styles';

export function Step1({ promotion }: StepProps) {
  const step: CurrentStepProps = '1';

  return (
    <S.ContentWrapper step={step}>
      <S.LeftContent>
        <FormItem label="Título" required minHeight="4rem">
          <Input value={promotion.title} readOnly />
        </FormItem>

        <S.DatesWrapper>
          <FormItem label="Data de início" required minHeight="4rem">
            <DatePicker
              format="DD/MM/YYYY"
              value={dayjs(promotion.start_at)}
              inputReadOnly
            />
          </FormItem>

          <FormItem label="Data de término" required minHeight="4rem">
            <DatePicker
              format="DD/MM/YYYY"
              value={dayjs(promotion.end_at)}
              inputReadOnly
            />
          </FormItem>
        </S.DatesWrapper>

        <FormItem label="Mensagem da promoção" required>
          <TextArea
            rows={4}
            placeholder="Ex: Se cadastre no nosso app e ganhe uma sobremesa grátis!"
            value={promotion.message}
            readOnly
          />
        </FormItem>

        <FormItem
          rowDirection
          label="Permitido que o cliente se cadastre mais de uma vez"
          labelPosition="right"
        >
          <Checkbox checked={promotion.restriction === 'unlimited'} />
        </FormItem>

        <S.DiscountFormItem label="Desconto" minHeight="4rem">
          <div>
            <InputNumber
              type="number"
              placeholder="de 10 a 100"
              value={promotion.discount}
              readOnly
            />
            <strong className="percent">%</strong>
          </div>
        </S.DiscountFormItem>

        <S.CustomDivider withoutMargin />

        <S.ItensWrapper>
          <Title level={4}>Item da promoção:</Title>

          <FormItem title="Item da promoção" minHeight="4rem">
            <Input
              placeholder={!promotion.item ? 'Não definido' : undefined}
              value={promotion.item ?? undefined}
              readOnly
            />
          </FormItem>
        </S.ItensWrapper>

        <S.StatusPromotionWrapper title="Status">
          <Switch
            title="Ativar/Inativar"
            checked={promotion.status === 'active'}
          />

          <Title level={4}>
            Promoção {promotion.status === 'active' ? 'ativa' : 'inativa'}
          </Title>
        </S.StatusPromotionWrapper>
      </S.LeftContent>

      <S.RightContent step={step}>
        <S.PreVisualization>
          <Title level={4}>Pré visualização</Title>

          <S.PreviewBox>
            <S.PreviewDetails>
              <Title level={4}>{promotion.title}</Title>
              <Paragraph>{promotion.message}</Paragraph>

              <Button>Ganhar {promotion.item || 'agora'}</Button>
            </S.PreviewDetails>

            <S.PreviewImageWrapper>
              <img src={promotion.banner} alt={promotion.title} />
            </S.PreviewImageWrapper>
          </S.PreviewBox>
        </S.PreVisualization>
      </S.RightContent>
    </S.ContentWrapper>
  );
}

import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Input, Select, DatePicker, TimePicker, InputNumber } from 'antd';
import { Modal } from 'src/stories/feedback/Modal';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { BOARD_HALLS, BOARD_OCCASIONS } from 'src/configs/devMockReservations';
import type { ReservationData } from 'src/configs/devMockReservations';
import * as S from './styles';

interface AddReservationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ReservationData, 'id' | 'createdAt' | 'status'>) => void;
  /** Quando presente, o modal edita a reserva em vez de criar. */
  initial?: ReservationData | null;
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  guests: number | null;
  date: Dayjs | null;
  time: Dayjs | null;
  hall: string;
  occasion: string | null;
  note: string;
};

const EMPTY: FormState = {
  name: '',
  phone: '',
  email: '',
  guests: null,
  date: dayjs(),
  time: dayjs().hour(20).minute(0),
  hall: BOARD_HALLS[0],
  occasion: null,
  note: '',
};

export function AddReservationModal({
  open,
  onClose,
  onSubmit,
  initial,
}: AddReservationModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setForm(
        initial
          ? {
              name: initial.name,
              phone: initial.phone ?? '',
              email: initial.email ?? '',
              guests: initial.guests,
              date: dayjs(),
              time: dayjs(initial.time, 'HH:mm'),
              hall: initial.hall,
              occasion: initial.occasion ?? null,
              note: initial.note ?? '',
            }
          : EMPTY
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const set = (patch: Partial<FormState>) => setForm((old) => ({ ...old, ...patch }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Informe o nome do cliente.');
      return;
    }
    if (!form.guests || form.guests < 1) {
      setError('Informe a quantidade de pessoas.');
      return;
    }
    if (!form.time) {
      setError('Informe o horário da reserva.');
      return;
    }

    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      guests: form.guests,
      time: form.time.format('HH:mm'),
      hall: form.hall,
      occasion: form.occasion || undefined,
      note: form.note.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={initial ? 'Editar Reserva' : 'Adicionar Reserva'}
      width={620}
    >
      <S.Body>
        <S.SectionTitle>
          <Title level={5}>Informações do cliente</Title>
        </S.SectionTitle>

        <S.Field>
          <S.Label>Nome</S.Label>
          <Input
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Nome do cliente"
          />
        </S.Field>

        <S.Row>
          <S.Field>
            <S.Label>Telefone</S.Label>
            <Input
              addonBefore="+55"
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </S.Field>

          <S.Field>
            <S.Label>E-mail</S.Label>
            <Input
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="cliente@email.com"
            />
          </S.Field>
        </S.Row>

        <S.SectionTitle>
          <Title level={5}>Informações da reserva</Title>
        </S.SectionTitle>

        <S.Row>
          <S.Field>
            <S.Label>Pessoas</S.Label>
            <InputNumber
              min={1}
              max={50}
              value={form.guests}
              onChange={(value) => set({ guests: value })}
              style={{ width: '100%' }}
              placeholder="2"
            />
          </S.Field>

          <S.Field>
            <S.Label>Data</S.Label>
            <DatePicker
              value={form.date}
              onChange={(value) => set({ date: value })}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </S.Field>

          <S.Field>
            <S.Label>Horário</S.Label>
            <TimePicker
              value={form.time}
              onChange={(value) => set({ time: value })}
              format="HH:mm"
              minuteStep={5}
              style={{ width: '100%' }}
            />
          </S.Field>
        </S.Row>

        <S.Row>
          <S.Field>
            <S.Label>Salão</S.Label>
            <Select
              value={form.hall}
              onChange={(value) => set({ hall: value })}
              style={{ width: '100%' }}
              options={BOARD_HALLS.map((h) => ({ value: h, label: h }))}
            />
          </S.Field>

          <S.Field>
            <S.Label>Mesa</S.Label>
            <Input
              disabled
              placeholder="Digite os números das mesas"
            />
          </S.Field>
        </S.Row>

        <S.SectionTitle>
          <Title level={5}>Mais informações</Title>
        </S.SectionTitle>

        <S.Row>
          <S.Field>
            <S.Label>Ocasião</S.Label>
            <Select
              allowClear
              value={form.occasion}
              onChange={(value) => set({ occasion: value })}
              style={{ width: '100%' }}
              placeholder="Selecione a ocasião"
              options={BOARD_OCCASIONS.map((o) => ({ value: o, label: o }))}
            />
          </S.Field>

          <S.Field>
            <S.Label>Observações</S.Label>
            <Input
              value={form.note}
              onChange={(e) => set({ note: e.target.value })}
              placeholder="Observações da reserva"
            />
          </S.Field>
        </S.Row>

        {error && <S.ErrorText>{error}</S.ErrorText>}

        <S.Footer>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {initial ? 'Salvar' : 'Adicionar'}
          </Button>
        </S.Footer>
      </S.Body>
    </Modal>
  );
}

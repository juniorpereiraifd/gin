import * as S from './styles';

const days = [
  {
    id: 7,
    label: 'Domingo',
    letter: 'D',
  },
  {
    id: 1,

    label: 'Segunda',
    letter: 'S',
  },
  {
    id: 2,

    label: 'Terça',
    letter: 'T',
  },
  {
    id: 3,

    label: 'Quarta',
    letter: 'Q',
  },
  {
    id: 4,

    label: 'Quinta',
    letter: 'Q',
  },
  {
    id: 5,

    label: 'Sexta',
    letter: 'S',
  },
  {
    id: 6,

    label: 'Sabádo',
    letter: 'S',
  },
];

const Days = ({
  activeDays = [],
  onChange = () => null,
}: {
  activeDays?: Array<number>;
  onChange?: (day: number) => void;
}) => (
  <S.Wrapper aria-label="Lista de dias da semana">
    {days.map((day) => (
      <S.Day
        key={day.label}
        aria-label={day.label}
        onClick={() => onChange(day.id)}
        active={!!activeDays.find((index) => index === day.id)}
      >
        {day.letter}
      </S.Day>
    ))}
  </S.Wrapper>
);

export default Days;

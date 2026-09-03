import { FunctionComponent, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from 'src/lib/utils';
import { Button } from 'src/ui/Button';
import { Calendar } from 'src/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'src/ui/Popover';
import { Select, SelectContent, SelectItem, SelectProps, SelectTrigger, SelectValue } from 'src/ui/Select';

type DatePickerProps = {
  onRangeChange: (range: DateRange) => void;
  preset?: {
    defaultValue: SelectProps['value'];
  };
  defaultDate?: {
    from: Date;
    to: Date;
  } | null;
};

export const DatePicker: FunctionComponent<DatePickerProps> = (props) => {
  const { preset, onRangeChange, defaultDate } = props;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: defaultDate?.from || subDays(new Date(), 31),
    to: defaultDate?.to || subDays(new Date(), 1),
  });
  const [isCustomDate, setIsCustomDate] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-medium shadow-sm text-slate-600',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'dd LLL, y', { locale: ptBR })} - {format(date.to, 'dd LLL, y', { locale: ptBR })}
              </>
            ) : (
              format(date.from, 'dd LLL, y')
            )
          ) : (
            <span>Escolha um período</span>
          )}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
        <Select
          defaultValue={preset?.defaultValue}
          onValueChange={(value) => {
            setDate({
              from: subDays(new Date(), parseInt(value) + 1),
              to: subDays(new Date(), 1),
            });
            setIsCustomDate(false);
            setOpen(false);
            onRangeChange({
              from: subDays(new Date(), parseInt(value) + 1),
              to: subDays(new Date(), 1),
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha um período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="15">Últimos 15 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="60">Últimos 60 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              setIsCustomDate(true);
            }}
            numberOfMonths={1}
          />
        </div>
        {isCustomDate === true && (
          <Button
            onClick={() => {
              if (date !== undefined) {
                onRangeChange(date);
                setOpen(false);
              }
            }}
          >
            Aplicar
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

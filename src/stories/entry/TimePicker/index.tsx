import { TimePickerProps } from 'antd/lib/time-picker';
import * as S from './styles';

export const TimePicker = ({ ...props }: TimePickerProps) => <S.TimePicker {...props} />;

export default TimePicker;

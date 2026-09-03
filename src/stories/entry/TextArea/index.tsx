import { TextAreaProps } from 'antd/lib/input/TextArea';
import * as S from './styles';

export const TextArea = ({ ...props }: TextAreaProps) => <S.TextArea {...props} />;

export default TextArea;

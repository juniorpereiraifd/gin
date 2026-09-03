import * as S from './styles';

type LoadingProps = {
  size?: number | string;
};

const Loading = ({ size = 20 }: LoadingProps) => <S.Loading size={size} />;

export default Loading;

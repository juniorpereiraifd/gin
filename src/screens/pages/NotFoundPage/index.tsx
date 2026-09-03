import { Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Title, Paragraph } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import NotFoundImage from 'src/assets/images/404.svg';
import * as S from './styles';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <S.Wrapper align="middle" justify="center">
      <Col xl={12}>
        <S.Container>
          <Title>Erro 404!</Title>
          <S.Image src={NotFoundImage} alt="Erro 404 - Página não encontrada" />
          <Paragraph>Ops... parece que esta página não existe!</Paragraph>
          <Button onClick={() => navigate('/units')}>
            Voltar para o início
          </Button>
        </S.Container>
      </Col>
    </S.Wrapper>
  );
};

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Download } from '@styled-icons/evaicons-solid/Download';
import { QrCodeScanner } from '@styled-icons/material-outlined/QrCodeScanner';
import { LinkAlt } from '@styled-icons/boxicons-regular/LinkAlt';
import { Title } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import { notification } from 'src/utils/helpers';
import api from 'src/services/api';
import { BoxContrasted } from 'src/components/BoxContrasted';
import * as S from './styles';

type Props = {
  unitId: string;
  unitName: string;
};

export const QrcodeBadge = (props: Props) => {
  const { unitId, unitName } = props;
  const [loadingQr, setLoadingQr] = useState(false);
  const {
    nps: { settings },
  } = useSelector((state: RootType) => state);

  const handleClickDownload = async () => {
    setLoadingQr(true);

    const { data: response, status } = await api.get(
      `/nps/v1/units/${unitId}/downloads/qrcode`,
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/zip',
        },
      }
    );

    if (status === 200) {
      const blob = new Blob([response], {
        type: 'application/zip',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${unitName}-qrcode.zip`;
      link.click();
      link.remove();
    } else {
      notification.error(
        'Erro no download',
        'Houve algum problema no download do Qr Code, entre em contato com o suporte e tente novamente.'
      );
    }

    setLoadingQr(false);
  };

  const handleToAddClipboard = () => {
    if (settings !== null && settings.link) {
      navigator.clipboard.writeText(settings.link);

      return notification.success(
        'Sucesso',
        'O link de compartilhamento foi copiado com sucesso!'
      );
    } else {
      return notification.error(
        'Erro',
        'Não foi possível gerar o link de compartilhamento, tente novamente mais tarde.'
      );
    }
  };

  return (
    <BoxContrasted>
      <S.Header>
        <Title icon={<QrCodeScanner size={20} />} level={5}>
          QR Code
        </Title>
      </S.Header>
      <S.Text>
        Faça o download do seu QR Code de NPS, para utilizar em seu restaurante.
      </S.Text>
      <S.Footer>
        <Button
          icon={<Download size={20} />}
          onClick={handleClickDownload}
          loading={loadingQr}
        >
          Download
        </Button>
        <Button icon={<LinkAlt size={20} />} onClick={handleToAddClipboard}>
          Link compartilhável
        </Button>
      </S.Footer>
    </BoxContrasted>
  );
};

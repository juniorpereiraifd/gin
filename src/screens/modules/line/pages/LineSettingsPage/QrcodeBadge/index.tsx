import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import api from 'src/services/api';

import { Title } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import { Download } from '@styled-icons/evaicons-solid/Download';
import { QrCodeScanner } from '@styled-icons/material-outlined/QrCodeScanner';
import { Display } from '@styled-icons/bootstrap/Display';

import * as S from './styles';

export const QrcodeBadge = () => {
  const {
    hall: { unity },
  } = useSelector((state: RootType) => state);
  const [loadingQr, setLoadingQr] = useState(false);
  const [loadingDisplay, setLoadingDisplay] = useState(false);

  const handleClickDownload = async (type: 'qrcode' | 'display') => {
    type === 'qrcode' && setLoadingQr(true);
    type === 'display' && setLoadingDisplay(true);

    const { data: response, status } = await api.get(
      `line/v1/units/${unity?.id}/downloads/${type}`,
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: type === 'qrcode' ? 'application/zip' : 'application/pdf',
        },
      }
    );

    if (status === 200) {
      const blob = new Blob([response], {
        type: type === 'qrcode' ? 'application/zip' : 'application/pdf',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${unity?.name}.${type === 'qrcode' ? 'zip' : 'pdf'}`;
      link.click();
      link.remove();
    }

    type === 'qrcode' && setLoadingQr(false);
    type === 'display' && setLoadingDisplay(false);
  };

  return (
    <S.Container>
      <S.ContentHeader>
        <Title icon={<Download size={20} />} level={5}>
          Download
        </Title>
      </S.ContentHeader>
      <S.Text>
        Faça o download do seu QR Code de fila, para utilizar em seu
        restaurante.
      </S.Text>
      <S.Footer>
        <Button
          variant="outlined"
          icon={<QrCodeScanner size={20} />}
          onClick={() => handleClickDownload('qrcode')}
          loading={loadingQr}
        >
          QR Code
        </Button>
        <Button
          variant="outlined"
          icon={<Display size={20} />}
          onClick={() => handleClickDownload('display')}
          loading={loadingDisplay}
        >
          Display
        </Button>
      </S.Footer>
    </S.Container>
  );
};

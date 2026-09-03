import { Copy, ExternalLink } from 'lucide-react';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Button } from 'src/stories/general/Button';
import { notification } from 'src/utils/helpers';
import type { WidgetProps } from 'src/store/modules/widget/reducer';
import type { FunctionComponent } from 'react';
import { Heading } from 'src/ui/Typograph';

type SharingSectionProps = {
  selectedWidget: WidgetProps | null;
};

export const SharingSection: FunctionComponent<SharingSectionProps> = (props) => {
  const { selectedWidget } = props;

  const handleCopyLinkShare = async () => {
    try {
      await navigator.clipboard.writeText(`${import.meta.env.VITE_WIDGET_BASE_URL}/${selectedWidget?.id}`);
      notification.success('Sucesso', 'O link de compartilhamento foi copiado com sucesso!');
    } catch (error) {
      notification.error('Houve um erro ao copiar o link', 'Atualize a página e tente novamente!');
    }
  };

  return (
    <BoxContrasted>
      <Heading level="5">Link para compartilhamento</Heading>
      <div className="flex flex-col gap-3 mt-6">
        <p className="text-sm text-slate-500">Utilize o link abaixo para compartilhar o widget.</p>
        <div className="flex items-center justify-between border border-gray-200 rounded-md py-3 px-4">
          <div className="flex items-center gap-2 text-blue-800">
            <a
              href={`${import.meta.env.VITE_WIDGET_BASE_URL}/${selectedWidget?.id}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {`${import.meta.env.VITE_WIDGET_BASE_URL}/${selectedWidget?.id}`}
            </a>
            <ExternalLink size={14} />
          </div>
          <Button icon={<Copy size={14} />} onClick={handleCopyLinkShare}>
            Copiar
          </Button>
        </div>
      </div>
    </BoxContrasted>
  );
};

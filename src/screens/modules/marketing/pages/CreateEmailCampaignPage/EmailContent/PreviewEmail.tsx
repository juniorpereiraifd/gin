import { useSelector } from 'react-redux';
import { EmailTemplate } from 'src/store/modules/marketing/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import Logo from 'src/stories/utils/Logo';
import * as S from '../styles';
import { Heading } from 'src/ui/Typograph';
import { Image } from 'lucide-react';
import { Divider } from 'antd';

export type PreviewSize = 'sm' | 'lg';

interface PreviewEmailProps {
  emailContent: EmailTemplate | undefined;
  size: PreviewSize;
}

export function PreviewEmail({ emailContent }: PreviewEmailProps) {
  const hasImage = !!emailContent?.image;
  const hasTitle = !!emailContent?.title;
  const hasMessage = !!emailContent?.body;

  const {
    hall: { unity },
  } = useSelector((state: RootType) => state);

  const image = typeof emailContent?.image === 'string' ? emailContent.image : emailContent?.image?.content;

  return (
    <div className="flex flex-col justify-between w-full h-[42rem] max-h-full overflow-auto max-w-xl p-1 border border-slate-300 rounded-md">
      <div className="flex flex-col gap-4">
        <S.ImagePreviewWrapper className="pointer-events-none select-none">
          {hasImage ? (
            <img src={image} alt="Pré-visualização da imagem do corpo do email" />
          ) : (
            <span className="text-sm text-slate-600 flex items-center gap-4">
              <Image size={16} /> Sua imagem ficará aqui
            </span>
          )}
        </S.ImagePreviewWrapper>
        <div className="text-center flex flex-col items-center gap-6 px-2">
          <Heading level="4" className="text-lg select-none">
            {hasTitle ? emailContent?.title : 'Titulo dentro do email'}
          </Heading>
          <p className="text-sm font-normal text-slate-600 select-none">
            {hasMessage ? (
              <div dangerouslySetInnerHTML={{ __html: emailContent?.body }} />
            ) : (
              'Este é um exemplo de como ficará sua mensagem.'
            )}
          </p>
          {emailContent?.personalized_button && (
            <Button className="pointer-events-none">{emailContent?.button_name}</Button>
          )}
        </div>
      </div>
      <div className="w-full bg-stone-100 mt-6 select-none">
        <div className="flex flex-col items-center justify-center py-3 px-2">
          <span className="text-sm font-semibold text-stone-700">{unity?.name || 'Nome da unidade'}</span>
          <span className="text-xs text-stone-500">
            {unity?.address || 'Rua'}, {unity?.number || 'número'}
          </span>
          <span className="text-xs text-stone-500">{unity?.neighborhood || 'Bairro'}</span>
        </div>
        <Divider className="border-slate-300 m-0" />
        <div className="flex flex-col items-center justify-center py-3 px-2 text-xs text-stone-500 leading-4">
          <span className="flex items-center gap-1 [&_svg]:h-4 [&_svg]:w-9">
            Email enviado com <Logo size="small" />
          </span>
          <span>Se não quiser mais receber mensagens</span>
          <span>
            como esta,{' '}
            <a href="#" className="text-blue-800 pointer-events-none">
              descadastre-se aqui.
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

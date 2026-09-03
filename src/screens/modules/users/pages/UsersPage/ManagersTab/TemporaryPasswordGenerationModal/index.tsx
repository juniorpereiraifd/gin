import { Fragment, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Skeleton, Tooltip } from 'antd';
import { Copy, RotateCcwKey } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UserCreators } from 'src/store/modules/user/actions';
import { Button } from 'src/stories/general/Button';
import { notification } from 'src/utils/helpers';
import type { UserItemProps } from 'src/store/modules/user/reducer';

type TemporaryPasswordGenerationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: VoidFunction;
  manager: UserItemProps | null;
};

export const TemporaryPasswordGenerationModal: FunctionComponent<TemporaryPasswordGenerationModalProps> = (props) => {
  const { open, setOpen, onClose, manager } = props;
  const dispatch = useDispatch();
  const {
    user: { loadingTemporaryPassword, temporaryPassword, errorTemporaryPassword },
  } = useSelector((state: RootType) => state);

  const handleClose = () => {
    setOpen(false);
    onClose();
    dispatch(UserCreators.clearTemporaryPassword());
  };

  const handleGenerateTemporaryPassword = () => {
    if (manager !== null) {
      dispatch(UserCreators.generateTemporaryPasswordRequest({ managerId: manager?.id.toString() }));
    }
  };

  const handleCopyPassword = () => {
    if (temporaryPassword) {
      notification.success('Senha temporária copiada para a área de transferência.', '');
      navigator.clipboard.writeText(temporaryPassword);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} onCancel={handleClose} title="Gerar senha temporária" footer={null}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">
          A senha temporária permite o acesso imediato ao sistema. Compartilhe-a com o usuário de forma segura e
          oriente-o a alterá-la assim que entrar na plataforma.
        </p>
        <p className="text-gray-700">
          Ao gerar a senha temporária, <b>a senha atual do gerente {manager?.name} será invalidada</b>. Tem certeza que
          deseja prosseguir?
        </p>
        {errorTemporaryPassword === true ? (
          <div className="w-full flex border border-red-500 bg-red-50 rounded-md">
            <p className="p-4 text-red-700">
              Ocorreu um erro ao gerar a senha temporária. Por favor, tente novamente mais tarde.
            </p>
          </div>
        ) : (
          <Fragment>
            {temporaryPassword ? (
              <div className="flex items-center justify-center my-6">
                <div className="flex items-center border border-gray-300 rounded-md py-3 px-4 gap-3">
                  {loadingTemporaryPassword ? (
                    <Skeleton.Button active className="!w-32" />
                  ) : (
                    <span className="text-base font-medium">{temporaryPassword}</span>
                  )}
                  <Tooltip title="Copiar senha temporária">
                    <Button
                      variant="outlined"
                      icon={<Copy size={16} className="text-gray-600" />}
                      onClick={handleCopyPassword}
                    />
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center my-6">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleGenerateTemporaryPassword}
                  icon={<RotateCcwKey size={16} />}
                  loading={loadingTemporaryPassword}
                >
                  Gerar senha temporária
                </Button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </Modal>
  );
};

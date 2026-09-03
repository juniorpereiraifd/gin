import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'src/stories/display/Table';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as UserCreators } from 'src/store/modules/user/actions';
import { Button } from 'src/stories/general/Button';
import { Plus, Send, Settings, RotateCcwKey } from 'lucide-react';
import type { UserItemProps } from 'src/store/modules/user/reducer';
import { ManagersMutationDrawer } from './ManagersMutationDrawer';
import { LinkedUnitsDrawer } from './LinkedUnitsDrawer';
import { TemporaryPasswordGenerationModal } from './TemporaryPasswordGenerationModal';

const ManagersTab = () => {
  const dispatch = useDispatch();
  const {
    auth: { user },
    hall: { unity },
    user: { loading, data: users, pagination: userPagination },
  } = useSelector((state: RootType) => state);
  const [selectedManagerToGeneratePassword, setSelectedManagerToGeneratePassword] = useState<UserItemProps | null>(
    null,
  );
  const [isLinkedUnitsDrawerOpen, setIsLinkedUnitsDrawerOpen] = useState(false);
  const [isTemporaryPasswordGenerationModalOpen, setIsTemporaryPasswordGenerationModalOpen] = useState(false);

  useEffect(() => {
    if (unity) {
      dispatch(UserCreators.getUsersRequest({ page: 1 }));
    }
  }, [unity]);

  const handleLoadMore = (page: number, perPage?: number) => {
    dispatch(UserCreators.getUsersRequest({ page: page, perPage: perPage || userPagination?.per_page }));
  };

  const handleDeleteUser = (user: UserItemProps) => {
    dispatch(UserCreators.deleteUserRequest(user));
  };

  const handleReinvite = (user: UserItemProps) => {
    dispatch(
      UserCreators.sendEmailUserRequest({
        user_id: user.id,
        email: user.email,
      }),
    );
  };

  const handleAddManager = () => {
    dispatch(
      UserCreators.setMutationDrawerOpen({
        open: true,
      }),
    );
  };

  const handleManageUnits = (user: UserItemProps) => {
    dispatch(UserCreators.getUserRequest(String(user.id)));
    setIsLinkedUnitsDrawerOpen(true);
  };

  const handleGenerateTemporaryPassword = (manager: UserItemProps) => {
    setSelectedManagerToGeneratePassword(manager);
    setIsTemporaryPasswordGenerationModalOpen(true);
  };

  return (
    <Fragment>
      <Table<UserItemProps>
        bordered
        className="shadow-sm row-start-2 col-start-1 [&_.ant-pagination]:px-4"
        dataSource={users}
        loading={loading}
        actions={{
          delete: { onClick: handleDeleteUser },
          custom: [
            ...(user?.master === true
              ? [
                  {
                    key: 'manage-units',
                    content: (
                      <span className="flex items-center gap-2">
                        <Settings size={14} />
                        Gerenciar unidades vinculadas
                      </span>
                    ),
                    onClick: handleManageUnits,
                    getDisabledState: (user: UserItemProps) => user.master,
                  },
                ]
              : []),
            {
              key: 'resend',
              content: (
                <span className="flex items-center gap-2">
                  <Send size={14} />
                  Reenviar convite
                </span>
              ),
              onClick: handleReinvite,
              getDisabledState: (user) => (user.name || null) !== null,
            },
            ...(user?.master === true
              ? [
                  {
                    key: 'temporary-password',
                    content: (
                      <span className="flex items-center gap-2">
                        <RotateCcwKey size={14} />
                        Gerar senha temporária
                      </span>
                    ),
                    onClick: (user: UserItemProps) => handleGenerateTemporaryPassword(user),
                  },
                ]
              : []),
          ],
        }}
        title={() => (
          <div className="w-full flex items-center justify-end">
            <div>
              <Button onClick={handleAddManager}>
                <Plus size={16} />
                Adicionar gerente
              </Button>
            </div>
          </div>
        )}
        pagination={{
          pageSize: userPagination?.per_page,
          total: userPagination?.total,
          current: userPagination?.current_page,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} gerentes`,
        }}
        onChange={(pagination) => handleLoadMore(pagination.current ?? 1, pagination.pageSize)}
        columns={[
          { title: 'Nome', dataIndex: 'name', key: 'name' },
          { title: 'E-mail', dataIndex: 'email', key: 'email' },
          {
            title: 'Função',
            dataIndex: 'email',
            key: 'role',
            render: (_: unknown, user) => (user.master ? 'Administrador' : 'Gerente'),
          },
        ]}
      />

      <ManagersMutationDrawer />
      <LinkedUnitsDrawer open={isLinkedUnitsDrawerOpen} setOpen={setIsLinkedUnitsDrawerOpen} />
      <TemporaryPasswordGenerationModal
        open={isTemporaryPasswordGenerationModalOpen}
        setOpen={setIsTemporaryPasswordGenerationModalOpen}
        onClose={() => setSelectedManagerToGeneratePassword(null)}
        manager={selectedManagerToGeneratePassword}
      />
    </Fragment>
  );
};

export default ManagersTab;

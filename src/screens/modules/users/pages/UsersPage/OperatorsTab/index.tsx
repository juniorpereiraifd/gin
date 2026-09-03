import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'src/stories/display/Table';
import { Button } from 'src/stories/general/Button';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as OperatorCreators } from 'src/store/modules/operator/actions';
import type { OperatorItemProps } from 'src/store/modules/operator/reducer';
import { Plus, Unplug } from 'lucide-react';
import { OperatorsMutationDrawer } from './OperatorsMutationDrawer';
import { LogoutOperatorModal } from './LogoutOperatorModal';

const OperatorsTab = () => {
  const dispatch = useDispatch();
  const {
    hall: { unity },
    operator: { data: operators, loading, pagination: agentPagination },
  } = useSelector((state: RootType) => state);
  const [isLogoutOperatorModalOpen, setIsLogoutOperatorModalOpen] = useState(false);
  const [selectedOperatorToLogout, setSelectedOperatorToLogout] = useState<OperatorItemProps | null>(null);

  useEffect(() => {
    if (unity) {
      dispatch(
        OperatorCreators.getOperatorsRequest({
          page: 1,
        }),
      );
    }
  }, [unity]);

  const handleLoadMore = (page: number, perPage?: number) => {
    dispatch(
      OperatorCreators.getOperatorsRequest({
        page: page,
        perPage: perPage || agentPagination?.per_page,
      }),
    );
  };

  const handleEditUser = (operator: OperatorItemProps) => {
    dispatch(OperatorCreators.getOperatorRequest({ operatorId: operator.id }, { editable: true }));
    dispatch(
      OperatorCreators.setMutationDrawerOpen({
        open: true,
      }),
    );
  };

  const handleDeleteUser = (operator: OperatorItemProps) => {
    dispatch(OperatorCreators.deleteOperatorRequest({ operatorId: operator.id }));
  };

  const handleAddOperator = () => {
    dispatch(
      OperatorCreators.setMutationDrawerOpen({
        open: true,
      }),
    );
  };

  const handleDisconnectOperator = (operatorId: string) => {
    dispatch(
      OperatorCreators.disconnectOperatorRequest({
        operatorId,
      }),
    );
  };

  return (
    <Fragment>
      <Table<OperatorItemProps>
        bordered
        className="shadow-sm row-start-2 col-start-1 [&_.ant-pagination]:px-4"
        dataSource={operators}
        loading={loading}
        actions={{
          custom: [
            {
              key: 'logout-operator',
              content: (
                <span className="flex items-center gap-2">
                  <Unplug size={14} /> Encerrar sessões
                </span>
              ),
              onClick: (operator: OperatorItemProps) => {
                setIsLogoutOperatorModalOpen(true);
                setSelectedOperatorToLogout(operator);
              },
            },
          ],
          edit: { onClick: handleEditUser },
          delete: {
            onClick: handleDeleteUser,
            content: (
              <Fragment>
                <p>Você realmente deseja excluir este item? Esta ação é permamente e irreversível.</p>
                <div className="bg-amber-100 p-4 rounded-md border border-amber-300">
                  <p className="text-xs text-amber-700">
                    Ao excluir, o operador será removido de <b>todas as unidades</b> vinculadas (caso tenha mais de
                    uma).
                  </p>
                </div>
              </Fragment>
            ),
          },
        }}
        title={() => (
          <div className="w-full flex items-center justify-end">
            <div>
              <Button onClick={handleAddOperator}>
                <Plus size={16} />
                Adicionar operador
              </Button>
            </div>
          </div>
        )}
        pagination={{
          pageSize: agentPagination?.per_page,
          total: agentPagination?.total,
          current: agentPagination?.current_page,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} operadores`,
          onChange: (page) => handleLoadMore(page),
        }}
        onChange={(pagination) => handleLoadMore(pagination.current ?? 1, pagination.pageSize)}
        columns={[
          { title: 'Nome', dataIndex: 'name', key: 'name' },
          { title: 'Usuário', dataIndex: 'username', key: 'username' },
        ]}
      />
      <OperatorsMutationDrawer />
      <LogoutOperatorModal
        open={isLogoutOperatorModalOpen}
        setOpen={setIsLogoutOperatorModalOpen}
        onClose={() => setSelectedOperatorToLogout(null)}
        onConfirm={() => {
          handleDisconnectOperator(selectedOperatorToLogout?.id as string);
          setIsLogoutOperatorModalOpen(false);
        }}
      />
    </Fragment>
  );
};

export default OperatorsTab;

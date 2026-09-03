import { FunctionComponent, useEffect } from 'react';
import { Row, Col, Skeleton, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'src/stories/general/Button';
import { Add } from '@styled-icons/ionicons-outline/Add';
import { RootType } from 'src/store/modules/rootReducer';
import CustomSpace from 'src/stories/utils/Space';
import { Title } from 'src/stories/typography';
import * as S from './styles';
import { Trash } from '@styled-icons/bootstrap/Trash';
import Popconfirm from 'src/stories/feedback/Popconfirm';
import { WEEKDAYS } from 'src/utils/constants';

import NewRestrictionForm from './NewRestrictionForm';

import { Creators as RestrictionCreators } from 'src/store/modules/restriction/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';

type AvailabilityTabProps = {
  menuId: string;
};

const AvailabilityTab: FunctionComponent<AvailabilityTabProps> = (props) => {
  const { menuId } = props;
  const dispatch = useDispatch();

  const {
    restriction: { loading, data: restrictions },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unity) {
      dispatch(RestrictionCreators.getRestrictionsRequest(menuId));
    }
  }, [menuId, dispatch, unity]);

  return (
    <BoxContrasted>
      <NewRestrictionForm menuId={menuId} />
      <Row justify="space-between" align="middle">
        <Col>
          <Space align="center" direction="horizontal" size={4}>
            <Title level={2}>Horários disponíveis</Title>
            {loading ? (
              <Skeleton.Button active />
            ) : (
              <S.SmallText noUnderline noPointer>
                {restrictions.length} Itens
              </S.SmallText>
            )}
          </Space>
        </Col>
        <Col>
          <Button
            onClick={() => dispatch(RestrictionCreators.showModal())}
            icon={<Add size={20} />}
          >
            Novo horário
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <S.Information>
            Caso queira exibir este cardápio apenas em dias e horários
            específicos, defina-os aqui.
          </S.Information>
        </Col>
      </Row>
      <S.OptionalsContainer>
        <CustomSpace size={15} fullWidth>
          {loading ? (
            <>
              <S.CustomSkeletonOptionals active />
              <S.CustomSkeletonOptionals active />
              <S.CustomSkeletonOptionals active />
              <S.CustomSkeletonOptionals active />
              <S.CustomSkeletonOptionals active />
            </>
          ) : restrictions.length > 0 ? (
            restrictions.map((restriction, index) => (
              <S.OptionalsListItemWrapper key={index}>
                <Space align="center" size={30}>
                  <Title level={4}>{WEEKDAYS[restriction.weekday]}</Title>
                  <Title level={6}>
                    {restriction.starts_at.slice(0, -3)} -{' '}
                    {restriction.ends_at.slice(0, -3)}
                  </Title>
                </Space>
                <Space align="center" size={15}>
                  <S.PencilWrapper>
                    <Popconfirm
                      title={`Você deseja realmente deletar o horário de "${
                        WEEKDAYS[restriction.weekday]
                      } (${restriction.starts_at.slice(
                        0,
                        -3
                      )} - ${restriction.ends_at.slice(0, -3)})"`}
                      okText="Confirmar"
                      cancelText="Cancelar"
                      onConfirm={() =>
                        dispatch(
                          RestrictionCreators.deleteRestrictionRequest({
                            ...restriction,
                            menu: menuId,
                          })
                        )
                      }
                      placement="top"
                    >
                      <Trash size={22} />
                    </Popconfirm>
                  </S.PencilWrapper>
                </Space>
              </S.OptionalsListItemWrapper>
            ))
          ) : (
            <Row justify="center">
              <Title level={5}>
                No momento este cardápio está sempre visível aos seus clientes.
              </Title>
            </Row>
          )}
        </CustomSpace>
      </S.OptionalsContainer>
    </BoxContrasted>
  );
};

export default AvailabilityTab;

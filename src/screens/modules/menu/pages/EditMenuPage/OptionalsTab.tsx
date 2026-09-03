/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionComponent, useEffect } from 'react';
import { Row, Col, Skeleton, Switch, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'src/stories/general/Button';
import { Pencil } from '@styled-icons/heroicons-outline/Pencil';
import { Add } from '@styled-icons/ionicons-outline/Add';
import { RootType } from 'src/store/modules/rootReducer';
import CustomSpace from 'src/stories/utils/Space';
import { Title } from 'src/stories/typography';
import * as S from './styles';
import { Trash } from '@styled-icons/bootstrap/Trash';
import Popconfirm from 'src/stories/feedback/Popconfirm';

import NewOptionalForm from './NewOptionalForm';

import { Creators as OptionalCreators } from 'src/store/modules/optional/action';
import { BoxContrasted } from 'src/components/BoxContrasted';

type OptionalsTabProps = {
  menuId: string;
};

const OptionalsTab: FunctionComponent<OptionalsTabProps> = (props) => {
  const { menuId } = props;
  const dispatch = useDispatch();

  const {
    optional: { loading, data: optionals },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unity) {
      dispatch(OptionalCreators.getOptionalsRequest());
    }
  }, [menuId, dispatch, unity]);

  return (
    <BoxContrasted>
      <NewOptionalForm />
      <Row justify="space-between" align="middle">
        <Col>
          <Space align="center" direction="horizontal" size={4}>
            <Title level={2}>Opcionais</Title>
            {loading ? (
              <Skeleton.Button active />
            ) : (
              <S.SmallText noUnderline noPointer>
                {optionals.length} Itens
              </S.SmallText>
            )}
          </Space>
        </Col>
        <Col>
          <Button onClick={() => dispatch(OptionalCreators.showModal())} icon={<Add size={20} />}>
            Adicionar opcional
          </Button>
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
          ) : (
            optionals.map((optional, index) => (
              <S.OptionalsListItemWrapper key={index}>
                <Space align="center">
                  <Title level={4}>{optional.title['pt-br']}</Title>
                </Space>
                <Space align="center" size={15}>
                  <Switch
                    defaultChecked={optional.active}
                    onChange={(checked) =>
                      dispatch(
                        OptionalCreators.editOptionalRequest({
                          id: optional.id,
                          active: checked,
                        })
                      )
                    }
                  />
                  <S.PencilWrapper onClick={() => dispatch(OptionalCreators.loadEditInfo(optional))}>
                    <Pencil size={22} />
                  </S.PencilWrapper>
                  <S.PencilWrapper>
                    <Popconfirm
                      title={`Você deseja realmente deletar o opcional "${optional.title['pt-br']}"`}
                      okText="Confirmar"
                      cancelText="Cancelar"
                      onConfirm={() => dispatch(OptionalCreators.deleteOptionalRequest(optional))}
                      placement="top"
                    >
                      <Trash size={22} />
                    </Popconfirm>
                  </S.PencilWrapper>
                </Space>
              </S.OptionalsListItemWrapper>
            ))
          )}
        </CustomSpace>
      </S.OptionalsContainer>
    </BoxContrasted>
  );
};

export default OptionalsTab;

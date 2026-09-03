import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { RootType } from 'src/store/modules/rootReducer';

import { Title } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import { Form, Divider } from 'antd';
import Loading from 'src/stories/feedback/Loading';
import * as S from './style';
import { ItemByCategory, StructureFormObj } from './types';
import { ListItemsByCategory } from './functions';
import { BoxContrasted } from 'src/components/BoxContrasted';

type AmenitiesProps = {
  unitId: string;
};

export const Amenities: FunctionComponent<AmenitiesProps> = (props) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    unity: { amenities, saving, loading },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  const [itemsByCategory, setItemsByCategory] = useState<ItemByCategory[]>([]);
  const [changeValues, setChangeValues] = useState(false);

  useEffect(() => {
    dispatch(HallCreators.getUnityRequest({ id: unitId, forceUpdate: true }));
    dispatch(UnityCreators.getListAmenitiesRequest());
  }, []); //eslint-disable-line

  useEffect(() => {
    if (unity && unity.amenities && unity.amenities.length > 0) {
      const objValuesForm: StructureFormObj = {}; //eslint-disable-line @typescript-eslint/no-explicit-any

      unity.amenities.forEach((item) => {
        Object.keys(objValuesForm).includes(item.category_id)
          ? objValuesForm[item.category_id].push(item.amenity_id)
          : Object.defineProperty(objValuesForm, item.category_id, {
              configurable: false,
              enumerable: true,
              value: [item.amenity_id],
              writable: true,
            });
      });

      form.setFieldsValue(objValuesForm);
    }
  }, [unity]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (amenities && amenities.length > 0) {
      const items = ListItemsByCategory(amenities);
      setItemsByCategory(items);
    }
  }, [amenities]);

  const handleOnFinish = (
    values: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
  ) => {
    const listAmenities: string[] = [];
    const objValues: string[][] = Object.values(values);

    objValues
      .filter((item) => item)
      .forEach((item) => listAmenities.push(...item));

    dispatch(
      UnityCreators.addListAmenitiesRequest({ amenities: listAmenities })
    );

    return setChangeValues(false);
  };

  return (
    <BoxContrasted>
      <Title level={4}>
        Adicione todas as facilidades oferecidas pelo estabelecimento.
      </Title>
      <S.Subtitle>
        Elas serão exibidas na sua página dentro da página do restaurante.{' '}
      </S.Subtitle>
      {loading ? (
        <S.ContainerLoader>
          <Loading size={30} /> Carregando
        </S.ContainerLoader>
      ) : (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleOnFinish}
          onChange={() => setChangeValues(true)}
          style={{ marginTop: '2rem' }}
        >
          {itemsByCategory.map((item) => (
            <>
              <Title level={5}>{item.category_name}</Title>
              <Form.Item name={item.category_id}>
                <S.WrapperOptions>
                  {item.items.map((option) => (
                    <S.Checkbox key={option.id} value={option.id}>
                      {option.name}
                    </S.Checkbox>
                  ))}
                </S.WrapperOptions>
              </Form.Item>
            </>
          ))}
          <Divider />
          <S.Footer>
            <Title level={4}>Tudo pronto? É só salvar!</Title>
            <Button htmlType="submit" loading={saving} disabled={!changeValues}>
              Salvar alterações
            </Button>
          </S.Footer>
        </Form>
      )}
    </BoxContrasted>
  );
};

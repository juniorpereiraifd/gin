import React from 'react';
import * as S from './styles';
import { Form } from 'antd';

import { Title } from 'src/stories/typography';
import TableIcon from 'src/assets/images/table.svg';
import Space from 'src/stories/utils/Space';
import { Minus } from '@styled-icons/boxicons-regular/Minus';
import { Add } from '@styled-icons/ionicons-outline/Add';
import { HALLS_TYPE } from 'src/utils/constants';

export type HallTableProps = {
  blocked?: boolean;
  size: string;
  type?: string | null;
};

const HallTable = ({ blocked = false, size, type = null }: HallTableProps) => {
  const [seater, setSeater] = React.useState<
    string | number | undefined | null
  >(2);
  const [table, setTable] = React.useState<string | number | undefined | null>(
    1
  );
  return (
    <S.Wrapper>
      <S.Header>
        <Title level={3} icon={<S.Icon src={TableIcon} alt="Ícone de mesa" />}>
          Mesas do salão
        </Title>
      </S.Header>
      {blocked ? (
        <S.Content blocked size={size}>
          <span>Não é possível adicionar mesas para datas bloqueadas</span>
        </S.Content>
      ) : (
        <Form.List name="schedule_map">
          {(fields, { add, remove }) => {
            return (
              <>
                <S.Content size={size}>
                  {fields.map((field) => (
                    <S.Data key={field.key}>
                      {type != HALLS_TYPE.TOTAL_SEATS && (
                        <Form.Item
                          {...field}
                          noStyle
                          name={[field.name, 'number_of_tables']}
                          fieldKey={[field.key, 'number_of_tables']}
                        >
                          <S.InputNumber min={1} />
                        </Form.Item>
                      )}
                      <span>mesa(s) de</span>
                      <Form.Item
                        noStyle
                        name={[field.name, 'number_of_people']}
                        fieldKey={[field.key, 'number_of_people']}
                      >
                        <S.InputNumber min={1} step={1} defaultValue={2} />
                      </Form.Item>
                      <span> lugar(es) </span>

                      <S.Remove
                        type="secondary"
                        onClick={() => remove(field.name)}
                      >
                        <Minus size={25} />
                      </S.Remove>
                    </S.Data>
                  ))}
                </S.Content>
                <S.Footer>
                  <Space size={15} direction="vertical">
                    <Title level={3}>Adicionar mesa</Title>
                    <S.AddWrapper>
                      {type != HALLS_TYPE.TOTAL_SEATS && (
                        <S.InputNumber
                          min={1}
                          defaultValue={1}
                          onChange={(quantity) => setTable(quantity)}
                        />
                      )}
                      <span> mesa(s) de</span>
                      <S.InputNumber
                        step={1}
                        min={1}
                        defaultValue={2}
                        onChange={(quantity) => setSeater(quantity)}
                      />
                      <span> lugar(es) </span>

                      <S.Remove
                        type="primary"
                        htmlType="button"
                        onClick={() =>
                          add({
                            number_of_tables:
                              type == HALLS_TYPE.TOTAL_SEATS ? null : table,
                            number_of_people: seater,
                          })
                        }
                      >
                        <Add size={25} />
                      </S.Remove>
                    </S.AddWrapper>
                  </Space>
                </S.Footer>
              </>
            );
          }}
        </Form.List>
      )}
    </S.Wrapper>
  );
};

export default HallTable;

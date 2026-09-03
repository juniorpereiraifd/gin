import { FunctionComponent, useState } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import { MinusCircleOutline } from '@styled-icons/evaicons-outline/MinusCircleOutline';
import { Camera } from '@styled-icons/heroicons-outline/Camera';
import Delete from 'src/components/Delete';
import { Input } from 'src/stories/entry';
import { Switch } from 'src/stories/entry/Switch';
import { Button } from 'src/stories/general/Button';
import * as S from './styles';
import { BannerBase } from 'src/store/modules/menu/reducer';
import { UploadFile } from 'antd/lib/upload/interface';

type MenuBannerCardProps = {
  id: number;
  saving: boolean;
  form: FormInstance<any>;
  restField: {
    fieldKey?: number;
  };
  type: BannerBase['type'];
  handleRemoveBanner: (fieldKey: number) => void;
  remove: (index: number | number[]) => void;
  beforeUpload: (file: RcFile) => boolean;
  handleChange: (info: UploadChangeParam<UploadFile>, fieldKey: number) => void;
  handleSaveBanner: (fieldKey: number) => void;
};

export const MenuBannerCard: FunctionComponent<MenuBannerCardProps> = (
  props
) => {
  const {
    id,
    saving,
    form,
    restField,
    type,
    handleRemoveBanner,
    remove,
    beforeUpload,
    handleChange,
    handleSaveBanner,
  } = props;
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const hasBannerId = (name: number) =>
    form.getFieldsValue().bannerList[name] !== undefined &&
    'id' in form.getFieldsValue().bannerList[name];

  const handleChangeUpload = (info: UploadChangeParam<UploadFile>) => {
    setIsSaveButtonDisabled(false);

    handleChange(info, id);
  };

  return (
    <S.BannerFieldsContent saving={saving}>
      <div className="card-header">
        <DragIndicator size={20} />
        {hasBannerId(id) === true ? (
          <Delete
            onDelete={() => (saving ? null : handleRemoveBanner(id))}
            className="delete-trigger"
          >
            <MinusCircleOutline size={20} />
          </Delete>
        ) : (
          <span onClick={() => (saving ? null : remove(id))}>
            <MinusCircleOutline size={20} />
          </span>
        )}
      </div>
      <Form.Item {...restField} name={[id, 'id']} noStyle />
      <Form.Item
        {...restField}
        name={[id, 'image']}
        className="upload-field-item"
      >
        <S.Upload
          maxCount={1}
          showUploadList={false}
          multiple={false}
          customRequest={() => null}
          beforeUpload={beforeUpload}
          onChange={handleChangeUpload}
          bannerType={type}
        >
          <S.PreviewImage>
            {form.getFieldValue('bannerList') !== undefined &&
            form.getFieldValue('bannerList')[id] !== undefined ? (
              <img src={form.getFieldValue('bannerList')[id].image.content} />
            ) : (
              <S.DetailUploadPreview>
                <Camera size={30} />
                <span className="dimensions">
                  {type === 'home' ? '1080 x 1919 px' : '984 x 300 px'}
                </span>
              </S.DetailUploadPreview>
            )}
          </S.PreviewImage>
        </S.Upload>
      </Form.Item>
      <Form.Item {...restField} name={[id, 'link']} label="Link">
        <Input
          onChange={() => setIsSaveButtonDisabled(false)}
          placeholder="https://google.com"
        />
      </Form.Item>
      <Form.Item
        {...restField}
        name={[id, 'active']}
        label="Ativo"
        className="active-switch"
        valuePropName="checked"
      >
        <Switch onChange={() => setIsSaveButtonDisabled(false)} />
      </Form.Item>
      <Button
        htmlType="button"
        onClick={() => handleSaveBanner(id)}
        disabled={isSaveButtonDisabled}
      >
        Salvar
      </Button>
    </S.BannerFieldsContent>
  );
};

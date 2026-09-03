import { Drawer, DrawerProps } from 'antd';
import type { FormInstance } from 'antd';
import { type FunctionComponent } from 'react';
import { Button } from 'src/stories/general/Button';
import { SubmitButton } from 'src/stories/general/SubmitButton';

type DefaultAction = {
  label: string;
  onClick: VoidFunction;
  loading?: boolean;
  disabled?: boolean;
};

type MutationUserDrawerProps = DrawerProps & {
  form: FormInstance;
  actions: {
    save: DefaultAction;
    cancel: DefaultAction;
  };
};

export const MutationUserDrawer: FunctionComponent<MutationUserDrawerProps> = (props) => {
  const {
    form,
    actions: { save, cancel },
    children,
    ...rest
  } = props;

  return (
    <Drawer
      size="large"
      footer={
        <div className="flex items-center justify-end gap-4 p-2">
          <Button
            variant="outlined"
            onClick={cancel.onClick}
            disabled={cancel.disabled || cancel.loading}
            loading={cancel.loading}
          >
            {cancel.label}
          </Button>
          <SubmitButton
            form={form}
            onClick={save.onClick}
            disabled={save.disabled || save.loading}
            loading={save.loading}
          >
            {save.label}
          </SubmitButton>
        </div>
      }
      {...rest}
    >
      {children}
    </Drawer>
  );
};

import { FunctionComponent } from 'react';
import { Modal as BaseModal, ModalProps as BaseModalProps } from 'antd';

export type ModalProps = BaseModalProps;

export const Modal: FunctionComponent<ModalProps> = (props) => (
  <BaseModal {...props} />
);

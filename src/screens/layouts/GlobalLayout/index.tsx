import { Fragment, FunctionComponent, ReactNode } from 'react';

type GlobalLayoutProps = {
  children: ReactNode;
};

export const GlobalLayout: FunctionComponent<GlobalLayoutProps> = (props) => {
  return <Fragment>{props.children}</Fragment>;
};

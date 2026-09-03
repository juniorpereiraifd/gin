import { Tabs as BaseTabs, TabsProps as BaseTabsProps } from 'antd';
import { FunctionComponent } from 'react';

export type TabsProps = BaseTabsProps;

export const Tabs: FunctionComponent<TabsProps> = (props) => {
  return <BaseTabs {...props} />;
};

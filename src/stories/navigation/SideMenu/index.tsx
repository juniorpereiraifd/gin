import { Fragment, FunctionComponent, ReactElement, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skeleton } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Lock } from '@styled-icons/remix-line/Lock';
import * as S from './styles';

export type ItemsProps = {
  key: string;
  label: string;
  icon?: ReactElement;
  children?: ItemsProps[];
};

type SideMenuProps = {
  hiddenOptions: string[];
  baseUrl: string;
  items: ItemsProps[];
  onClickMenuItem?: () => void;
  loading?: boolean;
};

export const SideMenu: FunctionComponent<SideMenuProps> = (props) => {
  const { hiddenOptions, onClickMenuItem, baseUrl, loading, items } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([...pathname.replace(baseUrl, '').split('/')]);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    if (hiddenOptions.includes(keys[1]) === true) {
      return;
    }

    const latestOpenKey = keys.find((key) => openKeys.indexOf(key as string) === -1) as string;

    if (items.find((item) => item.key === latestOpenKey)?.children === undefined) {
      setOpenKeys(keys as unknown as string[]);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleClickItem = (value: MenuInfo) => {
    if (hiddenOptions.includes(value.keyPath[0]) === true) {
      return;
    }

    navigate(baseUrl + `${value.keyPath[0]}`);

    onClickMenuItem?.();
  };

  const getItems = (items: ItemsProps[]) => {
    return items.map((item) =>
      item.children ? (
        <S.Submenu
          key={item.key}
          className={pathname.replace(baseUrl, '').split('/')[0].includes(item.key) ? 'ant-menu-submenu-selected' : ''}
          icon={item.icon}
          menuDisabled={hiddenOptions.includes(item.key)}
          onTitleClick={(e) => hiddenOptions.includes(item.key) === true && navigate(`${baseUrl}module/${e.key}`)}
          title={
            hiddenOptions.includes(item.key) ? (
              <S.SubMenuTitle>
                {item.label}
                <Lock size={20} />
              </S.SubMenuTitle>
            ) : (
              item.label
            )
          }
        >
          {hiddenOptions.includes(item.key) === false && getItems(item.children)}
        </S.Submenu>
      ) : (
        <Fragment key={item.key}>
          {item.key === 'account' && <S.Divider />}
          <S.Item
            key={item.key}
            icon={item.icon}
            itemDisabled={hiddenOptions.includes(item.key)}
            onClick={(e) => hiddenOptions.includes(item.key) === true && navigate(`${baseUrl}module/${e.key}`)}
          >
            {hiddenOptions.includes(item.key) ? (
              <S.SubMenuTitle>
                {item.label}
                <Lock size={20} />
              </S.SubMenuTitle>
            ) : (
              item.label
            )}
          </S.Item>
        </Fragment>
      )
    );
  };

  return loading === true ? (
    <S.LoadingContent>
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton.Button key={index} active block />
      ))}
    </S.LoadingContent>
  ) : (
    <S.Menu
      openKeys={openKeys}
      selectedKeys={[pathname.replace(baseUrl, '')]}
      onOpenChange={onOpenChange}
      onClick={handleClickItem}
      mode="inline"
    >
      {getItems(items)}
    </S.Menu>
  );
};

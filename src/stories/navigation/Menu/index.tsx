import { Dropdown } from 'antd';
import type { MenuProps as BaseMenuProps } from 'antd';
import { User } from '@styled-icons/boxicons-solid/User';
import * as S from './styles';

export type MenuProps = {
  /**
   * Name of authenticated user
   */
  username?: string;
  items?: BaseMenuProps['items'];
};

/**
 * A main header menu component with authenticated user and navigation flow.
 */
export const Menu = ({ username, items }: MenuProps) => {
  return (
    <S.Wrapper>
      {(items ?? null) !== null && (
        <Dropdown menu={{items}} placement="bottomRight">
          <S.UserInfo>
            <User size={16} />
            <span>{username}</span>
          </S.UserInfo>
        </Dropdown>
      )}
    </S.Wrapper>
  );
};

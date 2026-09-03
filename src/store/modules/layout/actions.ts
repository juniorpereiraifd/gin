import { ActionCreators, createActions } from 'reduxsauce';

export enum Types {
  SET_SIDE_MENU_OPEN = '@layout/SET_SIDE_MENU_OPEN',
  SET_SIDE_MENU_COLLAPSED = '@layout/SET_SIDE_MENU_COLLAPSED',
}

interface Actions extends ActionCreators {
  setSideMenuOpen: (
    open: boolean
  ) => {
    type: Types.SET_SIDE_MENU_OPEN;
    open: boolean;
  };
  setSideMenuCollapsed: (
    collapsed: boolean
  ) => {
    type: Types.SET_SIDE_MENU_COLLAPSED;
    collapsed: boolean;
  };
}

const CreatedActions = createActions(
  {
    setSideMenuOpen: ['open'],
    setSideMenuCollapsed: ['collapsed'],
  },
  {
    prefix: '@layout/',
  }
);

export const Creators = CreatedActions.Creators as Actions;

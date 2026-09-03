import produce from 'immer';
import { Types as ComunicationTypes } from './actions';

export type LayoutProps = {
  isSideMenuOpen: boolean;
  isSideMenuCollapsed: boolean;
};

export const INITIAL_STATE: LayoutProps = {
  isSideMenuOpen: false,
  isSideMenuCollapsed: false,
};

const layout = produce((draft: LayoutProps, action) => {
  switch (action.type) {
    case ComunicationTypes.SET_SIDE_MENU_OPEN:
      draft.isSideMenuOpen = action.open;
      break;

    case ComunicationTypes.SET_SIDE_MENU_COLLAPSED:
      draft.isSideMenuCollapsed = action.collapsed;
      break;
  }
}, INITIAL_STATE);

export default layout;

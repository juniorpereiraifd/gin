import { combineReducers } from 'redux';
import auth, { AuthProps } from './auth/reducer';
import blockade, { BlockadeProps } from './blockade/reducer';
import category, { CategoryProps } from './category/reducer';
import comunication, { ComunicationProps } from './comunication/reducer';
import contract, { ContractProps } from './contract/reducer';
import customField, { CustomFieldProps } from './customField/reducer';
import dashboard, { DashboardProps } from './dashboard/reducer';
import hall, { HallProps } from './hall/reducer';
import information, { InformationProps } from './information/reducer';
import line, { LineProps } from './line/reducer';
import marketing, { MarketingReducerProps } from './marketing/reducer';
import menu, { MenuProps } from './menu/reducer';
import noshow, { NoShowProps } from './noShow/reducer';
import nps, { NpsProps } from './nps/reducer';
import operator, { OperatorProps } from './operator/reducer';
import optional, { OptionalProps } from './optional/reducer';
import photo, { PhotoProps } from './photo/reducer';
import product, { ProductProps } from './product/reducer';
import promotions, { PromotionsReducerProps } from './promotions/reducer';
import reservation, { ReservationProps } from './reservation/reducer';
import restriction, { RestrictionProps } from './restriction/reducer';
import schedule, { ScheduleProps } from './schedule/reducer';
import setting, { SettingProps } from './setting/reducer';
import shift, { ShiftProps } from './shift/reducer';
import specialDate, { SpecialDateProps } from './specialDate/reducer';
import unity, { UnityProps } from './unity/reducer';
import user, { UserProps } from './user/reducer';
import widget, { WidgetReducerProps } from './widget/reducer';
import layout, { LayoutProps } from './layout/reducer';
import voucher, { VourcherProps } from './voucher/reducer';
import payment, { PaymentProps } from './payment/reducer';
import bookingExperiences, { ExperiencesProps } from './bookingExperiences/reducer';
import integrations, { IntegrationsProps } from './integrations/reducer';

const reducers = () =>
  combineReducers({
    // router: routerReducer,
    auth,
    unity,
    hall,
    blockade,
    specialDate,
    customField,
    information,
    setting,
    reservation,
    operator,
    user,
    menu,
    category,
    product,
    schedule,
    photo,
    optional,
    restriction,
    widget,
    contract,
    noshow,
    shift,
    promotions,
    line,
    dashboard,
    nps,
    marketing,
    comunication,
    bookingExperiences,
    layout,
    voucher,
    payment,
    integrations,
  });

export type RootType = {
  auth: AuthProps;
  // router: RouterState;
  unity: UnityProps;
  hall: HallProps;
  blockade: BlockadeProps;
  specialDate: SpecialDateProps;
  customField: CustomFieldProps;
  information: InformationProps;
  setting: SettingProps;
  reservation: ReservationProps;
  operator: OperatorProps;
  user: UserProps;
  menu: MenuProps;
  category: CategoryProps;
  product: ProductProps;
  schedule: ScheduleProps;
  photo: PhotoProps;
  optional: OptionalProps;
  restriction: RestrictionProps;
  widget: WidgetReducerProps;
  contract: ContractProps;
  noshow: NoShowProps;
  shift: ShiftProps;
  promotions: PromotionsReducerProps;
  line: LineProps;
  dashboard: DashboardProps;
  nps: NpsProps;
  marketing: MarketingReducerProps;
  comunication: ComunicationProps;
  bookingExperiences: ExperiencesProps;
  layout: LayoutProps;
  voucher: VourcherProps;
  payment: PaymentProps;
  integrations: IntegrationsProps;
};

export default reducers;

import { all, fork } from 'redux-saga/effects';
import auth from './auth/sagas';
import blockade from './blockade/sagas';
import category from './category/sagas';
import contract from './contract/sagas';
import customField from './customField/sagas';
import dashboard from './dashboard/sagas';
import comunication from './comunication/sagas';
import { watchInterceptor } from './error/sagas';
import hall from './hall/sagas';
import information from './information/sagas';
import line from './line/sagas';
import marketing from './marketing/sagas';
import menu from './menu/sagas';
import noshow from './noShow/sagas';
import nps from './nps/sagas';
import operator from './operator/sagas';
import optional from './optional/sagas';
import photo from './photo/sagas';
import product from './product/sagas';
import promotions from './promotions/sagas';
import reservation from './reservation/sagas';
import restriction from './restriction/sagas';
import schedule from './schedule/sagas';
import setting from './setting/sagas';
import shift from './shift/sagas';
import specialDate from './specialDate/sagas';
import unity from './unity/sagas';
import user from './user/sagas';
import widget from './widget/sagas';
import bookingExperiences from './bookingExperiences/sagas';
import voucher from './voucher/sagas';
import payment from './payment/sagas';
import integrations from './integrations/sagas';

export default function* rootSaga(): Generator {
  return yield all([
    fork(watchInterceptor),
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
    voucher,
    payment,
    integrations,
  ]);
}

import type { ReservationSettingsProps } from 'src/store/modules/setting/reducer';

export const NOSHOW_FALLBACK_SECTION_ID = 'noshow-fallback';

export const OVERBOOKING_SECTION_ID = 'overbooking';

type CanConfigureNoshowFallbackParams = {
  reservation: ReservationSettingsProps | null;
  isMaster: boolean;
  billingEnabled: boolean;
};

export const canConfigureNoshowFallback = (params: CanConfigureNoshowFallbackParams) => {
  const { reservation, isMaster, billingEnabled } = params;

  return isMaster || (billingEnabled === true && Boolean(reservation?.billing_service?.noshow));
};

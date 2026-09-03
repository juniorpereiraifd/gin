/* eslint-disable @typescript-eslint/no-explicit-any*/

import type { Octadesk } from 'src/services/octadesk';

declare global {
  interface Window {
    dataLayer: any;
    userGuiding: any;
    octadesk?: Octadesk;
  }
}

export declare const dataLayer = window.dataLayer;

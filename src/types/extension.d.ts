import { RoutesParams } from '../screens/routes';

declare module 'react-router-dom' {
  export declare function useParams<
    R extends keyof RoutesParams = null
  >(): RoutesParams[R] extends never ? null : RoutesParams[R];
}

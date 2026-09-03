(window.global as any) = globalThis;

export enum ModalStateEnum {
  OPENED = 1,
  CLOSED = 0,
}

export type ModalProps = ModalStateEnum.OPENED | ModalStateEnum.CLOSED;

type Opaque<T, K extends string> = T & { __typename: K };
export type Base64 = Opaque<string, 'base64'>;

export type Pagination = {
  total: number;
  current_page: number;
  next_page?: number | null;
  last_page: number;
  per_page: number;
  is_last_page: boolean;
};

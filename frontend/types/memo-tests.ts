import { PaginatorInfo } from "./paginator-info";

export type MemoTests = {
  data: MemoTest[];
  paginatorInfo: PaginatorInfo;
};

export type MemoTest = {
  id: string;
  name: string;
  images?: MemoTestImage[];
  createdAt?: string;
  updatedAt?: string;
};

export type MemoTestImage = {
  id: string;
  url: string;
};

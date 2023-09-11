import request from "graphql-request";
import { MemoTest, MemoTests } from "@/types";
import { QUERY_MEMO_TEST, QUERY_MEMO_TESTS } from "@/graphql";

import { API_GRAPHQL_URL } from "@/config/env";

export const queryMemoTestsServer = async ({
  pageParam = 1,
}: { pageParam?: number } = {}) => {
  const {
    memoTests: { data, paginatorInfo },
  } = await request<{ memoTests: MemoTests }>(
    API_GRAPHQL_URL,
    QUERY_MEMO_TESTS,
    {
      page: pageParam,
    },
  );

  return {
    data,
    paginatorInfo,
  };
};

export const queryMemoTestServer = async ({ id }: { id: string }) => {
  const { memoTest: data } = await request<{ memoTest: MemoTest }>(
    API_GRAPHQL_URL,
    QUERY_MEMO_TEST,
    { id },
  );

  return {
    data,
  };
};

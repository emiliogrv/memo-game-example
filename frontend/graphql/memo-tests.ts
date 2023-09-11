import { gql } from "graphql-request";

export const QUERY_MEMO_TESTS = gql`
  query memoTests($page: Int!) {
    memoTests(page: $page) {
      data {
        id
        name
      }
      paginatorInfo {
        currentPage
        hasMorePages
        lastPage
        total
      }
    }
  }
`;

export const QUERY_MEMO_TEST = gql`
  query memoTest($id: ID!) {
    memoTest(id: $id) {
      id
      name
      images {
        id
        url
      }
    }
  }
`;

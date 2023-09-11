import { gql } from "graphql-request";

export const MUTATION_CREATE_MEMO_TEST_SESSION = gql`
  mutation createMemoTestSession($memoTestID: ID!) {
    createMemoTestSession(input: { test: { connect: $memoTestID } }) {
      record {
        id
        numberOfPairs
        retries
      }
    }
  }
`;

export const MUTATION_UPDATE_MEMO_TEST_SESSION_RETRIES = gql`
  mutation updateMemoTestSessionRetries($id: ID!, $retries: Int!) {
    updateMemoTestSessionRetries(input: { id: $id, retries: $retries }) {
      recordID
    }
  }
`;

export const MUTATION_COMPLETE_MEMO_TEST_SESSION = gql`
  mutation completeMemoTestSession($id: ID!) {
    completeMemoTestSession(id: $id) {
      recordID
    }
  }
`;

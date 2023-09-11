export type MemoTestSessionActive = Pick<
  MemoTestSession,
  "id" | "numberOfPairs" | "retries"
>;

export type MemoTestSessionRecords = {
  lastScore: number;
  bestScore: number;
};

export type MemoTestSessionUncoveredRecord = { total: number } & Record<
  string,
  number
>;

export type SessionActiveProps = {
  memoTestID: string;
  imageID: string;
};

export type MemoTestSession = {
  id: string;
  numberOfPairs: number;
  retries: number;
};

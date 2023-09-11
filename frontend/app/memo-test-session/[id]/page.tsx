import { queryMemoTestServer } from "@/services/memo-tests-server";
import { notFound } from "next/navigation";
import { CardContainer } from "@/app/memo-test-session/[id]/card-container";
import { MemoTestImage } from "@/types";
import MtsRetriesText from "@/components/memo-test-session/mts-retries-text";
import { shuffleArray } from "@/shared";

function prepareArray(array: MemoTestImage[] = []) {
  return shuffleArray(array.concat(array));
}

export default async function MemoTestSessionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data } = await queryMemoTestServer({ id });

  if (!data) {
    notFound();
  }

  return (
    <>
      <header className="pb-4 my-8 border-b border-gray-600">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white text-center">
          {data.name}
        </h1>

        <p className="mb-2 text-lg text-gray-400 text-center">
          <MtsRetriesText memoTestID={id} />
        </p>
      </header>

      <main className="flex flex-col items-center">
        <section className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-10 max-w-[1024px]">
          <CardContainer
            memoTestID={data.id}
            images={prepareArray(data.images)}
          />
        </section>
      </main>
    </>
  );
}

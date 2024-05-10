import CardStack from "@/components/CardStack";
import ErrorView from "@/components/ErrorView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18nContext } from "@/i18n/i18n-react";
import { getCardsForCollection, getCollection } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createFileRoute("/collections/$collectionID/study")({
  component: CollectionStudy,
});

function CollectionStudy() {
  const { LL } = useI18nContext();
  const { collectionID } = Route.useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [
      `collection-${collectionID}`,
      `collection-${collectionID}-study`,
    ],
    queryFn: async () => {
      return {
        collection: await getCollection(collectionID),
        flashcards: await getCardsForCollection(collectionID),
      };
    },
  });

  if (error) {
    return (
      <ErrorView showHomeButton={true}>
        <Link
          to="/collections/$collectionID"
          className="mb-1 hover:underline"
          params={{ collectionID: collectionID }}
        >
          <Button className="my-2 block">{LL.GO_BACK_TO_COLLECTION()}</Button>
        </Link>
      </ErrorView>
    );
  }
  return (
    <div
      className={clsx(
        "flex flex-col justify-start items-start mx-auto min-h-full pb-2 w-full max-w-2xl",
      )}
    >
      <Link
        to="/collections/$collectionID"
        className="mb-1 hover:underline"
        params={{ collectionID: collectionID }}
      >
        <h2 className="text-2xl xl:text-3xl font-bold">
          {LL.GO_BACK_TO_COLLECTION()}
        </h2>
      </Link>
      <h1 className="text-4xl xl:text-5xl font-black mb-2">
        {LL.CARDS_FOR()}{" "}
        {isPending && (
          <Skeleton className="w-[7ch] h-[3.5rem] inline-block align-middle" />
        )}
        {data && <span className="text-blue-900">{data.collection.name}</span>}
      </h1>
      <div className="h-full w-full flex-1 flex flex-col">
        {isPending && (
          <Skeleton className="w-full h-full max-h-[30rem] flex-1" />
        )}
        {data && <CardStack items={data.flashcards} />}
      </div>
    </div>
  );
}

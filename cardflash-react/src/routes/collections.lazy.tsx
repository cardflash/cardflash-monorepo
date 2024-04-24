import AlertHelper from "@/components/ui/AlertHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  createCollection,
  getCountsForCollection,
  listCollections,
} from "@/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import {
  IoAddCircleOutline,
  IoFileTrayFullOutline,
  IoFileTrayOutline,
} from "react-icons/io5";
export const Route = createLazyFileRoute("/collections")({
  component: CollectionsPage,
});

function CollectionsPage() {
  const { LL } = useI18nContext();

  return (
    <div
      className={clsx(
        "flex flex-col justify-start items-start min-h-full w-full max-w-xl mx-auto",
      )}
    >
      <h1 className="text-3xl xl:text-5xl font-black my-4">
        {LL.ROUTES.COLLECTIONS()}
      </h1>
      <DocumentOverview />
    </div>
  );
}

function DocumentOverview() {
  const { LL } = useI18nContext();
  const { isPending, error, data } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const collections = await listCollections();
      const collectionsWithSizes = await Promise.all(
        collections.map(async (col) => ({
          col,
          counts: await getCountsForCollection(col.id),
        })),
      );
      return collectionsWithSizes;
    },
  });

  const queryClient = useQueryClient();

  const addCollectionMut = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="w-full h-full">
      <AlertHelper
        trigger={
          <Button title={LL.EDIT()}>
            <IoAddCircleOutline size={18} className="mr-1" />
            {LL.ADD()}...
          </Button>
        }
        title={LL.ADD()}
        initialData={{ name: "" }}
        content={({ data, setData, submit }) => (
          <div className="grid gap-y-2">
            <Label>{LL.NAME()}</Label>
            <Input
              autoFocus
              value={data.name}
              onChange={(ev) =>
                setData({ ...data, name: ev.currentTarget.value })
              }
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  submit(ev);
                }
              }}
            />
          </div>
        )}
        submitAction={LL.ADD()}
        mode="promise"
        onSubmit={async (data, ev) => {
          if (data.name.length > 0) {
            await addCollectionMut.mutateAsync({
              ...data,
              tags: [],
            });
          } else {
            if (ev) {
              ev.preventDefault();
              return false;
            }
          }
        }}
      />
      <ul className="mt-4 flex flex-wrap gap-2">
        {data.map((d) => (
          <Link
            key={d.col.id}
            className="w-full min-h-12 border dark:border-slate-700 rounded px-2 py-1 flex items-center gap-x-4 hover:bg-gray-50 dark:hover:bg-gray-900"
            to="/collections/$collectionID"
            params={{ collectionID: d.col.id }}
          >
            <div>
              {d.counts.numDocs > 0 && <IoFileTrayFullOutline size={32} />}

              {d.counts.numDocs === 0 && <IoFileTrayOutline size={32} />}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{d.col.name}</h3>
              {d.counts.numDocs} {LL.ROUTES.DOCUMENTS()}
              <br />
              {d.counts.numFlashcards} {LL.CARDS()}
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}

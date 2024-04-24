import AlertHelper from "@/components/ui/AlertHelper";
import FileDropZone from "@/components/ui/FileDropZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  Collection,
  PDFDocument,
  createPDFDocument,
  deleteCollection,
  getCollection,
  getCountsForCollection,
  listPDFDocumentsForCollection,
  updateCollection,
} from "@/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { AiOutlineFilePdf } from "react-icons/ai";
import { FiEdit, FiTrash } from "react-icons/fi";
import { z } from "zod";

const docIDSearchSchema = z.object({
  page: z.number().min(1).optional(),
});

export const Route = createFileRoute("/collections/$collectionID")({
  component: SingleCollectionPage,
  validateSearch: docIDSearchSchema,
});

function SingleCollectionPage() {
  const { collectionID } = Route.useParams();
  const { LL } = useI18nContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: [`collection-${collectionID}`],
    queryFn: async () => {
      return {
        collection: await getCollection(collectionID),
        counts: await getCountsForCollection(collectionID),
      };
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div
      className={clsx(
        "flex flex-col justify-start items-start mx-auto min-h-full pb-2 w-full max-w-xl",
      )}
    >
      <Link to="/collections" className="mb-1 hover:underline">
        <h2 className="text-2xl xl:text-3xl font-black">
          {LL.ROUTES.COLLECTIONS()}
        </h2>
      </Link>
      <h1 className="text-4xl xl:text-5xl font-black">
        {data.collection.name}
      </h1>
      <div className="flex gap-x-1">
        <AlertHelper
          trigger={
            <Button
              size="icon"
              variant="ghost"
              title={LL.DELETE()}
              className="shrink-0"
            >
              <FiTrash className="text-red-700" />
            </Button>
          }
          title={LL.DELETE()}
          initialData={undefined}
          content={() => (
            <div className="grid gap-y-2">
              {LL.COLLECTIONS.DELETE_COLLECTION_WARNING()}
            </div>
          )}
          submitAction={LL.DELETE()}
          mode="promise"
          onSubmit={async () => {
            await deleteCollection(data.collection.id);
            await queryClient.invalidateQueries({ queryKey: ["collections"] });
            await queryClient.invalidateQueries({ queryKey: ["flashcards"] });
            navigate({ to: "/collections" });
          }}
        />

        <AlertHelper
          trigger={
            <Button
              size="icon"
              variant="ghost"
              title={LL.EDIT()}
              className="shrink-0"
            >
              <FiEdit />
            </Button>
          }
          title={LL.EDIT()}
          initialData={data.collection}
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
          submitAction={LL.SAVE()}
          mode="promise"
          onSubmit={async (data, ev) => {
            if (data.name.length > 0) {
              await updateCollection(data);
              await queryClient.invalidateQueries({
                queryKey: [`collection-${collectionID}`],
              });
            } else {
              if (ev) {
                ev.preventDefault();
              }
            }
          }}
        />
      </div>
      <div className="mt-8 w-full h-full">
        <h2 className="text-2xl font-black mb-1">{LL.CARDS()}</h2>
        <p>
          {data.counts.numFlashcards} {LL.CARDS()}
        </p>
        <CollectionDocuments collection={data.collection} />
      </div>
    </div>
  );
}

function CollectionDocuments({ collection }: { collection: Collection }) {
  const { LL } = useI18nContext();
  const { isPending, error, data } = useQuery({
    queryKey: [`pdf-docs-${collection.id}`],
    queryFn: () => listPDFDocumentsForCollection(collection.id),
  });

  const queryClient = useQueryClient();

  const addDocMut = useMutation({
    mutationFn: async (args: {
      pdfDoc: Omit<
        PDFDocument,
        "attachmentID" | "id" | "lastUpdated" | "created"
      >;
      pdfBlob: Blob;
    }) => {
      const x = await createPDFDocument(args);
      return x;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`collection-${collection.id}`],
      });

      queryClient.invalidateQueries({
        queryKey: [`pdf-docs-${collection.id}`],
      });
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="w-full h-full">
      <h2 className="text-2xl font-black mb-1 mt-4">{LL.ROUTES.DOCUMENTS()}</h2>
      <ul className=" gap-2 justify-center grid grid-cols-1 md:grid-cols-5">
        {data.map(
          (d) =>
            d && (
              <Link
                key={d.id}
                to="/collections/documents/$docID"
                params={{ docID: d.id }}
                className="flex flex-col w-full md:aspect-square items-center justify-center gap-y-2 border py-2 px-2 rounded dark:border-gray-800 dark:hover:bg-slate-900 hover:bg-gray-50"
              >
                <AiOutlineFilePdf size={48} />
                <h3
                  title={d.name}
                  className="text-base font-semibold max-w-full text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {d.name}
                </h3>
              </Link>
            ),
          // <PDFDocElement key={d.id} doc={d} />
        )}
      </ul>
      <h3 className="text-xl font-bold mt-4">{LL.ADD()}</h3>
      <FileDropZone
        hintText=".pdf"
        inputProps={{ accept: "application/pdf" }}
        onFilesSelected={(files) => {
          if (files.length > 0) {
            addDocMut.mutate({
              pdfBlob: files[0],
              pdfDoc: {
                name: files[0].name.split(".pdf")[0],
                tags: [],
                collectionID: collection.id,
              },
            });
          }
        }}
      />
    </div>
  );
}

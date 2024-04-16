import AlertHelper from "@/components/ui/AlertHelper";
import FileDropZone from "@/components/ui/FileDropZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  PDFDocument,
  createPDFDocument,
  listPDFDocuments,
  updatePDFDocument,
} from "@/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { BsFilePdf } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
export const Route = createLazyFileRoute("/documents")({
  component: DocumentPage,
});

function DocumentPage() {
  const { LL } = useI18nContext();

  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-start mx-auto h-full w-full xl:max-w-5xl",
      )}
    >
      <h1 className="text-3xl xl:text-5xl font-black my-4">
        {LL.ROUTES.DOCUMENTS()}
      </h1>
      <DocumentOverview />
    </div>
  );
}

function DocumentOverview() {
  const { LL } = useI18nContext();
  const { isPending, error, data } = useQuery({
    queryKey: ["pdf-documents"],
    queryFn: () => listPDFDocuments(),
  });

  const queryClient = useQueryClient();

  const addDocMut = useMutation({
    mutationFn: createPDFDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdf-documents"] });
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="w-full h-full">
      <h2 className="text-2xl font-black mb-1">{LL.ADD()}</h2>
      <FileDropZone
        hintText=".pdf"
        inputProps={{ accept: "application/pdf" }}
        onFilesSelected={(files) => {
          if (files.length > 0) {
            addDocMut.mutate({
              pdfBlob: files[0],
              pdfDoc: { name: files[0].name.split(".pdf")[0], tags: [] },
            });
          }
        }}
      />
      <ul className="mt-8 flex flex-wrap gap-2">
        {data.map((d) => (
          <PDFDocElement key={d.id} doc={d} />
        ))}
      </ul>
    </div>
  );
}

function PDFDocElement({ doc }: { doc: PDFDocument }) {
  const { LL } = useI18nContext();
  const queryClient = useQueryClient();
  return (
    <li className="w-full flex justify-between items-center rounded border hover:bg-blue-50  dark:hover:bg-blue-800/20 border-blue-200 hover:border-blue-300 dark:border-blue-900 dark:hover:border-blue-800 px-3">
      <Link
        to="/documents/$docID"
        params={{ docID: doc.id }}
        className="flex justify-left items-center w-[calc(100%-3rem)] h-full py-3"
      >
        <BsFilePdf size={32} className="" />
        <h3
          title={doc.name}
          className="text-xl font-semibold ml-2 grow-0 w-full text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {doc.name}
        </h3>
      </Link>
      <AlertHelper
        trigger={
          <Button
            size="icon"
            variant="outline"
            title={LL.EDIT()}
            className="shrink-0"
          >
            <FiEdit />
          </Button>
        }
        title={LL.EDIT()}
        initialData={doc}
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
            await updatePDFDocument(data);
            await queryClient.invalidateQueries({
              queryKey: ["pdf-documents"],
            });
          } else {
            if (ev) {
              ev.preventDefault();
            }
          }
        }}
      />
    </li>
  );
}

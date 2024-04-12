import FileDropZone from "@/components/ui/FileDropZone";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  PDFDocument,
  createPDFDocument,
  listPDFDocuments,
} from "@/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { BsFilePdf } from "react-icons/bs";
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
    mutationFn: (newData: {
      newDoc: Omit<PDFDocument, "attachmentID" | "id" | "lastUpdated">;
      pdfBlob: Blob;
    }) => {
      return createPDFDocument(newData.newDoc, newData.pdfBlob);
    },
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
              newDoc: { name: files[0].name, tags: [] },
            });
          }
        }}
      />
      <ul className="mt-8 flex flex-wrap gap-4">
        {data.map((d) => (
          <PDFDocElement key={d.id} doc={d} />
        ))}
      </ul>
    </div>
  );
}

function PDFDocElement({ doc }: { doc: PDFDocument }) {
  return (
    <li className="">
      <Link
        className="w-[8rem] h-[8rem] xl:w-[12rem] xl:h-[12rem] px-1 py-2 flex flex-col items-center justify-center gap-y-2 xl:gap-y-4 rounded-lg border bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700"
        to="/documents/$docID"
        params={{ docID: doc.id }}
      >
        <h3
          title={doc.name}
          className="text-xl font-bold max-w-[7rem] text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {doc.name}
        </h3>
        <BsFilePdf size={32} />
      </Link>
    </li>
  );
}

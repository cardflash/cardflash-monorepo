import { CardStack } from "@/components/CardStack";
import FlashCardEditor from "@/components/FlashCardEditor";
import PDFViewer from "@/components/pdf/PDFViewer";
import { AddContentFunction } from "@/components/pdf/addContentFunction";
import AlertHelper from "@/components/ui/AlertHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  PDFDocument,
  deletePDFDocument,
  getPDFDocument,
  listFlashcardsForDocumentID,
  updatePDFDocument,
} from "@/lib/storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { z } from "zod";

const docIDSearchSchema = z.object({
  page: z.number().min(1).optional(),
});

export const Route = createFileRoute("/collections/documents/$docID")({
  component: SingleDocPage,
  validateSearch: docIDSearchSchema,
});

function SingleDocPage() {
  const { docID } = Route.useParams();
  const { page } = Route.useSearch();
  const { isPending, error, data } = useQuery({
    queryKey: [`pdf-document-${docID}`],
    queryFn: async () => {
      const doc = await getPDFDocument(docID);
      return {
        doc: doc.doc,
        objectURL: URL.createObjectURL(doc.pdfBlob),
      };
    },
  });

  useEffect(() => {
    return () => {
      if (data?.objectURL) {
        URL.revokeObjectURL(data?.objectURL);
      }
    };
  }, [data?.objectURL]);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <SingleDocumentView
        doc={data.doc}
        objectURL={data.objectURL}
        docID={docID}
        page={page}
      />
    </>
  );
}

function SingleDocumentView({
  objectURL,
  docID,
  doc,
  page,
}: {
  objectURL: string;
  docID: string;
  doc: PDFDocument;
  page: number | undefined;
}) {
  const { LL } = useI18nContext();
  const [activeTab, setActiveTab] = useState<
    "pdf-viewer" | "cards" | "combined"
  >(window.innerWidth > 1024 ? "combined" : "pdf-viewer");
  const flashcardEditorRef = useRef<{
    addContent: AddContentFunction;
  }>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data: cardData,
  } = useQuery({
    queryKey: [`pdf-document-${docID}-cards`],
    queryFn: async () => {
      return {
        cards: await listFlashcardsForDocumentID(docID),
      };
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(newActiveTab) =>
        setActiveTab(
          newActiveTab === "pdf-viewer"
            ? "pdf-viewer"
            : newActiveTab === "cards"
            ? "cards"
            : "combined",
        )
      }
      defaultValue="pdf-viewer"
      className="w-full h-full px-0 mx-0 flex flex-col"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
        <div className="flex justify-start w-fit mr-auto">
          <Link
            to="/collections/$collectionID"
            params={{ collectionID: doc.collectionID }}
          >
            <Button variant="ghost">
              <div className="flex gap-x-2 items-center">
                <IoArrowBack />
                {LL.GO_BACK()}
              </div>
            </Button>
          </Link>
        </div>
        <TabsList className="w-full flex">
          <TabsTrigger value="pdf-viewer" className="w-full">
            {LL.DOCUMENT()}
          </TabsTrigger>
          <TabsTrigger value="combined" className="w-full hidden sm:block">
            {LL.COMBINED()}
          </TabsTrigger>
          <TabsTrigger value="cards" className="w-full">
            {LL.CARDS()}
          </TabsTrigger>
        </TabsList>
        <div className="flex justify-end w-fit ml-auto">
          {/* Place for top-right buttons */}
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
                {LL.DOCUMENTS.DELETE_DOCUMENTS_WARNING()}
              </div>
            )}
            submitAction={LL.DELETE()}
            mode="promise"
            onSubmit={async () => {
              await deletePDFDocument(doc.id);
              await queryClient.invalidateQueries({
                queryKey: [`collection-${doc.collectionID}`],
              });
              navigate({
                to: "/collections/$collectionID",
                params: { collectionID: doc.collectionID },
              });
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
                  queryKey: [`pdf-document-${docID}`],
                });
                await queryClient.invalidateQueries({
                  queryKey: [`pdf-docs-${doc.collectionID}`],
                });
              } else {
                if (ev) {
                  ev.preventDefault();
                }
              }
            }}
          />
        </div>
      </div>
      <div
        className={clsx(
          "w-full mt-2 h-full grid",
          activeTab === "combined" && "grid-cols-2 gap-x-2",
          activeTab !== "combined" && "grid-cols-1",
        )}
      >
        <motion.div
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          layout
          className={clsx("w-full h-full", activeTab === "cards" && "hidden")}
        >
          {objectURL !== undefined && (
            <PDFViewer
              defaultPage={page}
              file={objectURL}
              addContent={(dataURL, pdfPage: number, side) => {
                flashcardEditorRef.current?.addContent(
                  dataURL,
                  {
                    pdfDocumentID: docID,
                    pdfPage: pdfPage,
                  },
                  side,
                );
              }}
            />
          )}
        </motion.div>
        <motion.div
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          layout
          className={clsx("w-full", activeTab === "pdf-viewer" && "hidden")}
        >
          <FlashCardEditor ref={flashcardEditorRef} doc={doc} />
          <div className="mt-6 max-w-lg mx-auto">
            <CardStack items={cardData.cards} />
          </div>
        </motion.div>
      </div>
    </Tabs>
  );
}

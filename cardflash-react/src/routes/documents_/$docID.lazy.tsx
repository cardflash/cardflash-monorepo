import FlashCardEditor from "@/components/FlashCardEditor";
import PDFViewer from "@/components/pdf/PDFViewer";
import { AddContentFunction } from "@/components/pdf/addContentFunction";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18nContext } from "@/i18n/i18n-react";
import { getPDFDocument } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { z } from "zod";

const docIDSearchSchema = z.object({
  page: z.number().min(1).optional(),
});

export const Route = createFileRoute("/documents/$docID")({
  component: SingleDocPage,
  validateSearch: docIDSearchSchema,
});

function SingleDocPage() {
  const { docID } = Route.useParams();
  const { page } = Route.useSearch();
  const { isPending, error, data } = useQuery({
    queryKey: [`pdf-document-${docID}`],
    queryFn: () => {
      return getPDFDocument(docID).then((doc) => ({
        doc,
        objectURL: URL.createObjectURL(doc.pdfBlob),
      }));
    },
  });

  useEffect(() => {
    return () => {
      if (data?.objectURL) {
        URL.revokeObjectURL(data.objectURL);
      }
    };
  }, [data?.objectURL]);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <SingleDocumentView objectURL={data.objectURL} docID={docID} page={page} />
  );
}

function SingleDocumentView({
  objectURL,
  docID,
  page,
}: {
  objectURL: string;
  docID: string;
  page: number | undefined;
}) {
  const { LL } = useI18nContext();
  const [activeTab, setActiveTab] = useState<
    "pdf-viewer" | "cards" | "combined"
  >("pdf-viewer");
  const flashcardEditorRef = useRef<{
    addContent: AddContentFunction;
  }>(null);

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
          <Link to="../">
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
            PDF
          </TabsTrigger>
          <TabsTrigger value="combined" className="w-full hidden sm:block">
            Combined
          </TabsTrigger>
          <TabsTrigger value="cards" className="w-full">
            Cards
          </TabsTrigger>
        </TabsList>
        <div className="flex justify-end w-fit ml-auto">
          {/* Place for top-right buttons */}
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
          className={clsx(
            "w-full h-full",
            activeTab === "pdf-viewer" && "hidden",
          )}
        >
          <FlashCardEditor ref={flashcardEditorRef} />
        </motion.div>
      </div>
    </Tabs>
  );
}

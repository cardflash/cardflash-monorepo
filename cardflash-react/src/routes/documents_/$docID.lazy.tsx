import FlashCardEditor from "@/components/FlashCardEditor";
import PDFViewer from "@/components/pdf/PDFViewer";
import { AddContentFunction } from "@/components/pdf/addContentFunction";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useI18nContext } from "@/i18n/i18n-react";
import { getPDFDocument } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  BsExclamationSquare,
  BsExclamationSquareFill,
  BsQuestionSquare,
  BsQuestionSquareFill,
} from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";

export const Route = createLazyFileRoute("/documents/$docID")({
  component: SingleDocPage,
});

function SingleDocPage() {
  const { docID } = Route.useParams();
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

  return <SingleDocumentView objectURL={data.objectURL} />;
}

function SingleDocumentView({ objectURL }: { objectURL: string }) {
  const { LL } = useI18nContext();
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const flashcardEditorRef = useRef<{
    addContent: AddContentFunction;
  }>(null);

  return (
    <Tabs
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
          <ToggleGroup
            type="single"
            value={activeSide}
            onValueChange={(val) =>
              setActiveSide(val === "front" ? "front" : "back")
            }
          >
            <ToggleGroupItem value="front">
              {activeSide === "front" && <BsQuestionSquareFill />}
              {activeSide !== "front" && <BsQuestionSquare />}
            </ToggleGroupItem>
            <ToggleGroupItem value="back">
              {activeSide === "back" && <BsExclamationSquareFill />}
              {activeSide !== "back" && <BsExclamationSquare />}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {/* Force mount & use CSS to display: none it if not visible; This allows easy switching between tabs without having to reload the PDF editor (and loose its state!) */}
      <TabsContent
        value="pdf-viewer"
        className="h-full data-[state=inactive]:-z-10 data-[state=inactive]:absolute data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0"
        forceMount={true}
      >
        {objectURL !== undefined && (
          <PDFViewer
            file={objectURL}
            addContent={(dataURL) => {
              flashcardEditorRef.current?.addContent(dataURL);
            }}
          />
        )}
      </TabsContent>
      <TabsContent
        value="cards"
        className="data-[state=inactive]:-z-10 data-[state=inactive]:absolute data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0"
        forceMount={true}
      >
        <FlashCardEditor ref={flashcardEditorRef} activeSide={activeSide} />
      </TabsContent>
    </Tabs>
  );
}

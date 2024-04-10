import FlashCardEditor from "@/components/FlashCardEditor";
import PDFViewer from "@/components/pdf/PDFViewer";
import { AddContentFunction } from "@/components/pdf/addContentFunction";
import FileDropZone from "@/components/ui/FileDropZone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  BsExclamationSquare,
  BsExclamationSquareFill,
  BsQuestionSquare,
  BsQuestionSquareFill,
} from "react-icons/bs";
export const Route = createLazyFileRoute("/documents")({
  component: DocumentPage,
});

function DocumentPage() {
  const { LL } = useI18nContext();
  const [file, setFile] = useState<string>();
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const flashcardEditorRef = useRef<{
    addContent: AddContentFunction;
  }>(null);

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file);
      }
    };
  }, [file]);

  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-start mx-auto h-full w-full xl:max-w-5xl",
      )}
    >
      {file === undefined && (
        <h1 className="text-3xl xl:text-5xl font-black my-4">
          {LL.ROUTES.DOCUMENTS()}
        </h1>
      )}
      <Tabs
        defaultValue="pdf-viewer"
        className="w-full h-full px-0 mx-0 flex flex-col"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
          <div className="flex justify-start w-fit mr-auto">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (file) {
                  URL.revokeObjectURL(file);
                  setFile(undefined);
                }
              }}
            >
              Clear
            </Button>
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
          {file === undefined && (
            <FileDropZone
              hintText=".pdf"
              inputProps={{ accept: "application/pdf" }}
              onFilesSelected={(files) => {
                console.log({ files });
                if (files.length > 0) {
                  const url = URL.createObjectURL(files[0]);
                  setFile(url);
                }
              }}
            />
          )}
          {file !== undefined && (
            <PDFViewer
              file={file}
              addContent={(dataURL) => {
                console.log("document got it!", flashcardEditorRef.current);
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
    </div>
  );
}

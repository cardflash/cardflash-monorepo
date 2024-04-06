import PDFViewer from "@/components/PDFViewer";
import FileDropZone from "@/components/ui/FileDropZone";
import { Button } from "@/components/ui/button";
import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import clsx from "clsx";
import FlashCardEditor from "@/components/FlashCardEditor";

export const Route = createLazyFileRoute("/documents")({
  component: DocumentPage,
});

function DocumentPage() {
  const { LL } = useI18nContext();
  const [file, setFile] = useState<string>();
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
        "flex flex-col justify-center items-start mx-auto h-full",
        file === undefined && "max-w-xl",
        file !== undefined && "w-full",
      )}
    >
      {file === undefined && (
        <h1 className="text-3xl xl:text-5xl font-black mt-4">
          {LL.ROUTES.DOCUMENTS()}
        </h1>
      )}
      <div className="h-full w-full mt-2 pb-2">
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
          <div className="h-full">
            <Tabs
              defaultValue="pdf-viewer"
              className="w-full h-full flex flex-col"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <div className="flex justify-start w-fit mr-auto">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      URL.revokeObjectURL(file);
                      setFile(undefined);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <TabsList className="w-full flex">
                  <TabsTrigger value="pdf-viewer" className="w-full">
                    PDF
                  </TabsTrigger>
                  <TabsTrigger
                    value="combined"
                    className="w-full hidden sm:block"
                  >
                    Combined
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="w-full">
                    Cards
                  </TabsTrigger>
                </TabsList>
                <div className="flex justify-end w-fit ml-auto">
                  {/* Place for top-right button */}
                </div>
              </div>
              {/* Force mount & use CSS to display: none it if not visible; This allows easy switching between tabs without having to reload the PDF editor (and loose its state!) */}
              <TabsContent
                value="pdf-viewer"
                className="h-full w-full data-[state=inactive]:hidden"
                forceMount={true}
              >
                <PDFViewer file={file} />
              </TabsContent>
              <TabsContent value="combined" className="h-full w-full">
                Combined
              </TabsContent>
              <TabsContent value="cards" className="h-full w-full">
                <FlashCardEditor />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

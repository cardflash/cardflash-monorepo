import PDFViewer from "@/components/PDFViewer";
import FileDropZone from "@/components/ui/FileDropZone";
import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/documents")({
  component: function Documents() {
    const { LL } = useI18nContext();
    const [file, setFile] = useState<string>();
    return (
      <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
        <h1 className="text-3xl xl:text-5xl font-black mt-4">
          {LL.ROUTES.DOCUMENTS()}
        </h1>
        <div className="h-full w-full">

        <FileDropZone hintText=".pdf" inputProps={{accept: "application/pdf"}} onFilesSelected={(files) => {
          console.log({files});
          if(files.length > 0){
            const url = URL.createObjectURL(files[0]);
            setFile(url);
          }
        }}/>
        {file !== undefined && <div className="mt-4 w-full h-[30rem]">
          <PDFViewer file={file}/>
        </div>}
        </div>
      </div>
    );
  },
});

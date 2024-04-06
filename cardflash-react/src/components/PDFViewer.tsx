import { PDFViewerApplication } from "@/lib/pdf-types";
import { useRef } from "react";

interface PDFViewerProps {
  file: string;
  defaultPage?: number;
}
export default function PDFViewer(props: PDFViewerProps) {
  const pdfIFrame = useRef<HTMLIFrameElement>(null);
  const pdfViewerApp = useRef<PDFViewerApplication>();

  return (
    <>
      {props.file && (
        <iframe
          key={devicePixelRatio}
          onLoadCapture={async (e) => {
            const w = e.currentTarget.contentWindow as
              | (Window & {
                  PDFViewerApplication?: PDFViewerApplication;
                  PDFViewerApplicationOptions: unknown;
                })
              | null;
            if (w) {
              if (w) {
                // w.document.onkeydown = handleKeyDownInIFrame;
                const style = w.document.createElement("style");
                style.innerHTML = `
            :root {
              --body-bg-color: 'white';
            }
            @font-face {
              font-family: "Virgil";
              src: url("/excalidraw-assets/Virgil.woff2");
            }
            @font-face {
              font-family: "Cascadia";
              src: url("/excalidraw-assets/Cascadia.woff2");
            }
            #editorModeButtons, #editorInkParamsToolbar, #openFile {
              display: none;
            }
            #pageNumber {
              height: 1rem;
            }
            `;
                w.document.head.appendChild(style);
              }
              if (w.PDFViewerApplication) {
                await w.PDFViewerApplication.initializedPromise;
                pdfViewerApp.current = w.PDFViewerApplication;
                // addPageRenderListeners(w.PDFViewerApplication.pdfViewer);
                // Handle (initial) dark mode
                // const mql = window.matchMedia("(prefers-color-scheme: dark)");
                // updatePDFDarkMode(mql.matches);
              }
            }
          }}
          className="h-full w-full outline outline-1 outline-gray-300 dark:outline-gray-600  rounded-sm"
          ref={pdfIFrame}
          src={`/pdfjs/viewer/viewer.html?file=${encodeURI(props.file)}&page=${
            props.defaultPage ?? 1
          }`}
        />
      )}
    </>
  );
}

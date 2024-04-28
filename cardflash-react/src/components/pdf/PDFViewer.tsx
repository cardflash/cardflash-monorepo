import { PDFViewerApplication } from "@/lib/pdf-types";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createRoot } from "react-dom/client";
import InsidePDFIFrameWrapper from "./InsidePDFIFrameWrapper";
import { AddableContent } from "./addContentFunction";
import { SourceLinkAttributes } from "../simple-editor/SourceLink";

interface PDFViewerProps {
  file: string;
  defaultPage?: number;
  documentID: string;
  addContent: (
    content: AddableContent,
    source: SourceLinkAttributes,
    side: "front" | "back",
  ) => unknown;
  onLoaded?: (pdfViewerApp: PDFViewerApplication) => unknown;
}

const LINK_EL_IFRAME_ID = "cardflash-styles";

export const PDFViewer = forwardRef<
  {
    getPDFApplication: () => PDFViewerApplication | undefined;
  },
  PDFViewerProps
>((props, ref) => {
  const pdfIFrame = useRef<HTMLIFrameElement>(null);
  const pdfViewerApp = useRef<PDFViewerApplication>();

  function addCSSToIFrameWindow(w: Window) {
    const prev = w.document.getElementById(LINK_EL_IFRAME_ID);
    if (prev) {
      if (w.document.getElementsByTagName("head")[0]) {
        w.document.getElementsByTagName("head")[0].removeChild(prev);
      }
    }
    import("../../index.css?url").then((res) => {
      w.document
        .getElementsByTagName("head")[0]
        .insertAdjacentHTML(
          "beforeend",
          `<link id="${LINK_EL_IFRAME_ID}" rel="stylesheet" href="${
            res.default + "#" + Math.random()
          }" />`,
        );
    });
  }

  function updatePDFDarkMode(darkModeActive: boolean) {
    if (pdfViewerApp.current?.pdfViewer.viewer) {
      const viewer = pdfViewerApp.current.pdfViewer.viewer as HTMLElement;
      if (darkModeActive) {
        viewer.style.filter = "invert(93%) hue-rotate(180deg)";
      } else {
        viewer.style.filter = "";
      }
    }
  }

  useEffect(() => {
    if (pdfIFrame.current?.contentWindow) {
      addCSSToIFrameWindow(pdfIFrame.current.contentWindow);
    }
    if (typeof window !== "undefined" && window) {
      // Intitial Dark Mode set is handled after iframe is loaded
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const onChangeFunction = (e: MediaQueryListEvent) => {
        updatePDFDarkMode(e.matches);
      };
      mql.onchange = onChangeFunction;
      updatePDFDarkMode(mql.matches);
      return () => {
        mql.removeEventListener("change", onChangeFunction);
      };
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({ getPDFApplication: () => pdfViewerApp.current }),
    [],
  );

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

                addCSSToIFrameWindow(w);
                // const style = w.document.createElement("style");
                //     style.innerHTML = `
                // :root {
                //   --body-bg-color: 'white';
                // }
                // @font-face {
                //   font-family: "Virgil";
                //   src: url("/excalidraw-assets/Virgil.woff2");
                // }
                // @font-face {
                //   font-family: "Cascadia";
                //   src: url("/excalidraw-assets/Cascadia.woff2");
                // }
                // #editorModeButtons, #editorInkParamsToolbar, #openFile {
                //   display: none;
                // }
                // #pageNumber {
                //   height: 1rem;
                // }
                // `;
                // w.document.head.appendChild(style);
                const rootEl = w.document.createElement("div");
                rootEl.style.position = "absolute";
                rootEl.style.height = "100%";
                rootEl.style.width = "100%";
                rootEl.style.top = "0";
                rootEl.style.left = "0";
                rootEl.style.pointerEvents = "none";

                w.document.body.appendChild(rootEl);
                const root = createRoot(rootEl);
                root.render(
                  <InsidePDFIFrameWrapper
                    iframeWindow={w}
                    pdfViewerApp={pdfViewerApp}
                    addContent={props.addContent}
                    documentID={props.documentID}
                  />,
                );
              }
              if (w.PDFViewerApplication) {
                await w.PDFViewerApplication.initializedPromise;
                pdfViewerApp.current = w.PDFViewerApplication;
                props.onLoaded && props.onLoaded(w.PDFViewerApplication);
                // pdfViewerApp.current.preferences.set('sidebarViewOnLoad',0);
                // addPageRenderListeners(w.PDFViewerApplication.pdfViewer);
                // Handle (initial) dark mode
                const mql = window.matchMedia("(prefers-color-scheme: dark)");
                updatePDFDarkMode(mql.matches);
              }
            }
          }}
          className="h-full w-full outline outline-1 outline-gray-300 dark:outline-gray-600  rounded-sm"
          ref={pdfIFrame}
          src={`/pdfjs/viewer/viewer.html?file=${encodeURI(props.file)}#page=${
            (props.defaultPage ?? 0) + 1
          }`}
        />
      )}
    </>
  );
});

export default PDFViewer;

import { PDFViewerApplication } from "@/lib/pdf-types";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import cssURL from "../index.css?url";
import { PiSelectionPlusBold } from "react-icons/pi";
import debounce from "lodash.debounce";

interface PDFViewerProps {
  file: string;
  defaultPage?: number;
}
const LINK_EL_IFRAME_ID = "cardflash-styles";
export default function PDFViewer(props: PDFViewerProps) {
  const pdfIFrame = useRef<HTMLIFrameElement>(null);
  const pdfViewerApp = useRef<PDFViewerApplication>();
  console.log({ cssURL });

  useEffect(() => {
    if (pdfIFrame.current?.contentWindow) {
      console.log(cssURL, "TOOT");
      const prev =
        pdfIFrame.current.contentWindow.document.getElementById(
          LINK_EL_IFRAME_ID,
        );
      if (prev) {
        pdfIFrame.current.contentWindow.document
          .getElementsByTagName("head")[0]
          .removeChild(prev);
      }
      import("../index.css?url").then((res) => {
        console.log({ res });
        if (pdfIFrame.current?.contentWindow) {
          pdfIFrame.current.contentWindow.document
            .getElementsByTagName("head")[0]
            .insertAdjacentHTML(
              "beforeend",
              `<link id="${LINK_EL_IFRAME_ID}" rel="stylesheet" href="${
                res.default + "#" + Math.random()
              }" />`,
            );
        }
      });
    }
  }, []);
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
                w.document
                  .getElementsByTagName("head")[0]
                  .insertAdjacentHTML(
                    "beforeend",
                    `<link rel="stylesheet" href="${cssURL}" />`,
                  );

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
                const rootEl = w.document.createElement("div");
                rootEl.style.position = "absolute";
                rootEl.style.height = "100%";
                rootEl.style.width = "100%";
                rootEl.style.top = "0";
                rootEl.style.left = "0";

                w.document.body.appendChild(rootEl);
                const root = createRoot(rootEl);
                root.render(<InsidePDFIFrameWrapper />);
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

function InsidePDFIFrameWrapper() {
  const [toggled, setToggled] = useState(false);
  const selIndicatorRef = useRef<HTMLDivElement>(null);
  const selRef = useRef<{ x1: number; y1: number; x2: number; y2: number }>();

  function updateSelectionIndicatorRef() {
    if (selRef.current && selIndicatorRef.current) {
      const [x, width] =
        selRef.current.x1 < selRef.current.x2
          ? [selRef.current.x1, selRef.current.x2 - selRef.current.x1]
          : [selRef.current.x2, selRef.current.x1 - selRef.current.x2];

      const [y, height] =
        selRef.current.y1 < selRef.current.y2
          ? [selRef.current.y1, selRef.current.y2 - selRef.current.y1]
          : [selRef.current.y2, selRef.current.y1 - selRef.current.y2];
      selIndicatorRef.current.style.left = x + "px";
      selIndicatorRef.current.style.top = y + "px";
      selIndicatorRef.current.style.width = width + "px";
      selIndicatorRef.current.style.height = height + "px";
    }
  }

  const debouncedUpdateSelFun = debounce(updateSelectionIndicatorRef, 5, {
    maxWait: 50,
  });

  return (
    <>
      {toggled && (
        <div
          className="h-full w-full absolute z-[9990] bg-gray-800/30 pointer-events-auto"
          onMouseDownCapture={(ev) => {
            if (selRef.current !== undefined) {
              selRef.current = undefined;
            } else {
              selRef.current = {
                x1: ev.clientX,
                y1: ev.clientY,
                x2: ev.clientX,
                y2: ev.clientY,
              };
            }
            updateSelectionIndicatorRef();
          }}
          onMouseUpCapture={() => {
            selRef.current = undefined;
          }}
          onTouchStartCapture={(ev) => {
            if (selRef.current !== undefined) {
              selRef.current = undefined;
            } else {
              const touch = ev.touches[0];
              selRef.current = {
                x1: touch.clientX,
                y1: touch.clientY,
                x2: touch.clientX,
                y2: touch.clientY,
              };
            }
            updateSelectionIndicatorRef();
          }}
          onTouchEndCapture={() => {
            selRef.current = undefined;
          }}
          onMouseMoveCapture={(ev) => {
            if (selRef.current) {
              selRef.current.x2 = ev.clientX;
              selRef.current.y2 = ev.clientY;
              debouncedUpdateSelFun();
            }
          }}
          onTouchMoveCapture={(ev) => {
            const touch = ev.touches[0];
            if (selRef.current) {
              selRef.current.x2 = touch.clientX;
              selRef.current.y2 = touch.clientY;
              debouncedUpdateSelFun();
            }
          }}
        >
          <div
            className={clsx(
              "absolute outline-dashed outline-2 rounded-sm outline-gray-600 backdrop-brightness-125",
            )}
            ref={selIndicatorRef}
          ></div>
        </div>
      )}
      <motion.button
        className={clsx(
          "rounded-full absolute bottom-[1rem] left-[1rem] lg:bottom-[2rem] lg:left-[2rem] h-[4rem] w-[4rem] z-[9999] ",
          " shadow",
          !toggled &&
            "bg-gray-200 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600",
          toggled &&
            "bg-emerald-200 dark:bg-emerald-900 hover:bg-emerald-400 dark:hover:bg-emerald-800 border border-emerald-300 dark:border-emerald-700",
        )}
        animate={
          toggled
            ? { scale: [0.85, 1.0], rotate: "-90deg" }
            : { scale: [1.0, 0.85], rotate: "90deg" }
        }
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => {
          setToggled((t) => !t);
        }}
      >
        <PiSelectionPlusBold
          size={26}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        />
      </motion.button>
    </>
  );
}

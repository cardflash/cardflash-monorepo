import { PDFViewerApplication } from "@/lib/pdf-types";
import clsx from "clsx";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { LucideImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsExclamationSquareFill, BsQuestionSquareFill } from "react-icons/bs";
import { IoAdd, IoClose } from "react-icons/io5";
import { PiSelectionPlusBold } from "react-icons/pi";
import { AddableContent } from "./addContentFunction";

const DRAG_HANDLER_POSITIONS = [
  "TOP-LEFT",
  "TOP",
  "TOP-RIGHT",
  "RIGHT",
  "BOTTOM-RIGHT",
  "BOTTOM",
  "BOTTOM-LEFT",
  "LEFT",
] as const;

function removeCanvasBG(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixelData = imgData.data;
  const replacementColor = { r: 0, g: 0, b: 0, a: 0 };
  const colorMap: Map<string, number> = new Map();
  for (let i = 0, n = pixelData.length; i < n; i += 4) {
    const r = pixelData[i],
      g = pixelData[i + 1],
      b = pixelData[i + 2];
    const s = `${r}-${g}-${b}`;
    colorMap.set(s, (colorMap.get(s) ?? 0) + 1);
  }
  const colorEntries = [...colorMap.entries()];
  colorEntries.sort((a, b) => (a[1] > b[1] ? -1 : 1));
  const colorsToReplace = [colorEntries[0]].map((c) => c[0]);
  for (let i = 0, n = pixelData.length; i < n; i += 4) {
    const r = pixelData[i],
      g = pixelData[i + 1],
      b = pixelData[i + 2];
    const s = `${r}-${g}-${b}`;

    if (colorsToReplace.includes(s)) {
      pixelData[i] = replacementColor.r;
      pixelData[i + 1] = replacementColor.g;
      pixelData[i + 2] = replacementColor.b;
      pixelData[i + 3] = replacementColor.a;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function addImageSel(
  sel: RectangleSelection,
  pdfViewerApp: PDFViewerApplication,
  previewCanvas: HTMLCanvasElement,
) {
  let pageIndex = pdfViewerApp.page - 1;
  let pageFound = false;
  while (!pageFound) {
    const page = pdfViewerApp.pdfViewer._pages![pageIndex];
    if (!page) {
      console.warn("No page?!");
      return;
    }
    const pageCanvas: HTMLCanvasElement = page?.canvas;
    const pageCanvasRect = pageCanvas.getBoundingClientRect();
    if (pageCanvasRect.y > sel.y1 && pageCanvasRect.y > sel.y2) {
      pageIndex--;
      if (pageIndex < 0) {
        console.error(
          "Could not find page; Reached pageIndex <0 while trying.",
        );
        break;
      }
      continue;
    } else if (sel.y1 > pageCanvasRect.y + pageCanvasRect.height) {
      pageIndex++;
      if (pageIndex >= pdfViewerApp.pagesCount) {
        console.error(
          "Could not find page; Reached pageIndex >= pagesCount while trying.",
        );
        break;
      }
      continue;
    }
    pageFound = true;
    const scale: number = 1.0;
    const outputScale: { sx: number; sy: number } = page.outputScale;
    const pageCtx = pageCanvas.getContext("2d")!;
    const x = sel.x1 - pageCanvasRect.x;
    const y = sel.y1 - pageCanvasRect.y;
    const width = sel.x2 - sel.x1;
    const height = sel.y2 - sel.y1;
    const imgData = pageCtx.getImageData(
      scale * x * outputScale.sx,
      scale * y * outputScale.sy,
      scale * width * outputScale.sx,
      scale * height * outputScale.sy,
    );
    const previewCtx = previewCanvas.getContext("2d")!;
    previewCanvas.width = scale * width * outputScale.sx;
    previewCanvas.height = scale * height * outputScale.sy;
    previewCtx.putImageData(imgData, 0, 0);
    removeCanvasBG(previewCtx, previewCanvas.width, previewCanvas.height);
    const dataURL = previewCanvas.toDataURL();
    previewCanvas.width = 0;
    previewCanvas.height = 0;
    previewCtx.clearRect(0, 0, scale * width, scale * height);
    return dataURL;
  }
}

type RectangleSelection = { x1: number; y1: number; x2: number; y2: number };

interface InsidePDFIFrameWrapperProps {
  addContent: (
    content: AddableContent,
    pdfPage: number,
    side: "front" | "back",
  ) => unknown;
  iframeWindow: Window;
  pdfViewerApp: { current?: PDFViewerApplication };
}

export default function InsidePDFIFrameWrapper(
  props: InsidePDFIFrameWrapperProps,
) {
  const [toggled, setToggled] = useState(false);
  const selIndicatorRef = useRef<HTMLDivElement>(null);
  const selRef = useRef<RectangleSelection>();
  const dirRef = useRef<(typeof DRAG_HANDLER_POSITIONS)[number]>();
  const pointerDown = useRef(false);
  const [textSelPos, setTextSelPos] = useState<{
    x: number;
    y: number;
    el: HTMLDivElement;
  }>();
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");

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
      if (width > 10 && height > 10) {
        (
          selIndicatorRef.current.firstElementChild as HTMLElement
        ).style.display = "flex";
      } else {
        (
          selIndicatorRef.current.firstElementChild as HTMLElement
        ).style.display = "none";
      }
    }
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const debouncedUpdateSelFun = debounce(updateSelectionIndicatorRef, 5, {
    maxWait: 50,
  });

  const debounceTextSelFun = debounce(
    (clearTextSelPos?: boolean, el?: HTMLElement) => {
      if (clearTextSelPos) {
        setTextSelPos(undefined);
        return;
      }
      const rect = props.iframeWindow.document
        .getSelection()
        ?.getRangeAt(0)
        .getBoundingClientRect();
      if (rect == null) {
        return;
      }
      if (el && el.parentElement) {
        const div = props.iframeWindow.document.createElement("div");
        const pageRect = el.parentElement.getBoundingClientRect();
        el.parentElement.appendChild(div);
        // Element used in portal below
        setTextSelPos({
          y: rect.y - pageRect.top,
          x: rect.x + rect.width - pageRect.left + 15,
          el: div,
        });
      }
    },
    500,
  );

  function organizeSel() {
    if (selRef.current) {
      selRef.current = {
        x1: Math.min(selRef.current.x1, selRef.current.x2),
        y1: Math.min(selRef.current.y1, selRef.current.y2),
        x2: Math.max(selRef.current.x1, selRef.current.x2),
        y2: Math.max(selRef.current.y1, selRef.current.y2),
      };
    }
  }

  function handleMove({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) {
    if (selRef.current === undefined) {
      return;
    }
    if (pointerDown.current) {
      selRef.current.x2 = clientX;
      selRef.current.y2 = clientY;
    } else {
      if (dirRef.current !== undefined) {
        if (dirRef.current.includes("BOTTOM")) {
          selRef.current.y2 = clientY;
        }
        if (dirRef.current.includes("TOP")) {
          selRef.current.y1 = clientY;
        }
        if (dirRef.current.includes("LEFT")) {
          selRef.current.x1 = clientX;
        }
        if (dirRef.current.includes("RIGHT")) {
          selRef.current.x2 = clientX;
        }
      }
    }
    debouncedUpdateSelFun();
  }

  useEffect(() => {
    const selectionListener = () => {
      const sel: Selection | null = props.iframeWindow.document.getSelection();
      const text = sel?.toString();
      if (!text) {
        debounceTextSelFun(true);
        return;
      }
      if (sel && sel.focusNode) {
        if (
          sel.focusNode.parentElement?.parentElement?.className === "textLayer"
        ) {
          const el = sel.focusNode.parentElement.parentElement;
          debounceTextSelFun(false, el);
        }
      }
    };
    props.iframeWindow.document.addEventListener(
      "selectionchange",
      selectionListener,
    );

    return () => {
      props.iframeWindow.document.removeEventListener(
        "selectionchange",
        selectionListener,
      );
    };
  }, [debounceTextSelFun, props.iframeWindow]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      {!toggled &&
        textSelPos !== undefined &&
        createPortal(
          <div
            style={{ top: textSelPos.y + "px", left: textSelPos.x + "px" }}
            className="z-10 absolute flex-col items-center justify-center gap-y-1 pointer-events-auto flex"
          >
            <button
              data-ignore-ev
              onClick={(ev) => {
                ev.preventDefault();
                props.addContent(
                  {
                    type: "text",
                    text:
                      props.iframeWindow.document.getSelection()?.toString() ??
                      "-",
                  },
                  props.pdfViewerApp.current?.page ?? 1,
                  activeSide,
                );
                setTextSelPos(undefined);
                props.iframeWindow.document.getSelection()?.empty();
              }}
              className={clsx(
                "rounded-full h-[3rem] w-[3rem]  flex items-center justify-center",
                "bg-black dark:bg-black dark:text-white dark:hover:bg-gray-800 text-primary-foreground hover:bg-gray-700",
              )}
            >
              <IoAdd className="pointer-events-none" size={24} />
            </button>
            <button
              data-ignore-ev
              onClick={(ev) => {
                ev.preventDefault();
                setActiveSide((s) => (s === "front" ? "back" : "front"));
              }}
              className={clsx(
                "rounded-full h-[2.5rem] w-[2.5rem]  flex items-center justify-center",
                "text-white bg-black",
                activeSide === "front" && "text-orange-600 ",
                activeSide === "back" && "text-green-600",
              )}
            >
              {activeSide === "front" && <BsQuestionSquareFill />}
              {activeSide === "back" && <BsExclamationSquareFill />}
            </button>
            <button
              data-ignore-ev
              onClick={(ev) => {
                ev.preventDefault();
                setTextSelPos(undefined);
              }}
              className={clsx(
                "rounded-full h-[2rem] w-[2rem] flex items-center justify-center",
                "bg-black dark:bg-black dark:text-white dark:hover:bg-red-800 text-primary-foreground hover:bg-red-700",
              )}
            >
              <IoClose size={20} className="pointer-events-none" />
            </button>
          </div>,
          textSelPos.el,
        )}
      {toggled && (
        <div
          className="pointer-events-auto h-full w-full overflow-hidden absolute z-[9990] bg-gray-800/30"
          onMouseDownCapture={(ev) => {
            if (selRef.current !== undefined) {
              return;
            }
            if (
              "dataset" in ev.target &&
              (ev.target as HTMLElement).dataset["ignoreEv"]
            ) {
              return;
            }
            selRef.current = {
              x1: ev.clientX,
              y1: ev.clientY,
              x2: ev.clientX,
              y2: ev.clientY,
            };
            pointerDown.current = true;
            updateSelectionIndicatorRef();
          }}
          onMouseUpCapture={() => {
            pointerDown.current = false;
            dirRef.current = undefined;
            organizeSel();
          }}
          onMouseLeave={() => {
            pointerDown.current = false;
            dirRef.current = undefined;
            organizeSel();
          }}
          onTouchCancelCapture={() => {
            pointerDown.current = false;
            dirRef.current = undefined;
            organizeSel();
          }}
          onTouchStartCapture={(ev) => {
            if (selRef.current !== undefined) {
              return;
            }
            if (
              "dataset" in ev.target &&
              (ev.target as HTMLElement).dataset["ignoreEv"]
            ) {
              return;
            }
            const touch = ev.touches[0];
            selRef.current = {
              x1: touch.clientX,
              y1: touch.clientY,
              x2: touch.clientX,
              y2: touch.clientY,
            };
            pointerDown.current = true;
            updateSelectionIndicatorRef();
          }}
          onTouchEndCapture={() => {
            pointerDown.current = false;
            dirRef.current = undefined;
            organizeSel();
          }}
          onMouseMoveCapture={(ev) => {
            if (selRef.current !== undefined) {
              ev.preventDefault();
              handleMove(ev);
            }
          }}
          onTouchMoveCapture={(ev) => {
            if (selRef.current !== undefined) {
              ev.preventDefault();
              handleMove(ev.touches[0]);
            }
          }}
        >
          <div
            className={clsx(
              "absolute outline-dashed outline-2 rounded-sm outline-gray-600 backdrop-brightness-125",
            )}
            ref={selIndicatorRef}
          >
            <div
              style={{ display: "none" }}
              className="absolute right-0 xl:-right-2  xl:translate-x-full top-0 flex-col items-center justify-center gap-y-1"
            >
              <button
                data-ignore-ev
                onClick={(ev) => {
                  ev.preventDefault();
                  if (selRef.current) {
                    if (props.pdfViewerApp.current && canvasRef.current) {
                      // Ensure that x1 <= x2, y1 <= y2
                      organizeSel();
                      const dataURL = addImageSel(
                        { ...selRef.current },
                        props.pdfViewerApp.current,
                        canvasRef.current,
                      );
                      if (dataURL) {
                        props.addContent(
                          { type: "image", dataURL },
                          props.pdfViewerApp.current.page,
                          activeSide,
                        );
                        selRef.current = undefined;
                        setToggled(false);
                      }
                    }
                  }
                }}
                className={clsx(
                  "rounded-full h-[3rem] w-[3rem]  flex items-center justify-center",
                  "bg-primary text-primary-foreground hover:bg-gray-700 dark:hover:bg-gray-200",
                )}
              >
                <LucideImagePlus className="pointer-events-none" />
              </button>
              <button
                data-ignore-ev
                onClick={(ev) => {
                  ev.preventDefault();
                  setActiveSide((s) => (s === "front" ? "back" : "front"));
                }}
                className={clsx(
                  "rounded-full h-[2.5rem] w-[2.5rem]  flex items-center justify-center",
                  "text-white bg-black",
                  activeSide === "front" && "text-orange-600 ",
                  activeSide === "back" && "text-green-600",
                )}
              >
                {activeSide === "front" && <BsQuestionSquareFill />}
                {activeSide === "back" && <BsExclamationSquareFill />}
              </button>
              <button
                data-ignore-ev
                onClick={(ev) => {
                  ev.preventDefault();
                  selRef.current = undefined;
                  setToggled(false);
                }}
                className={clsx(
                  "rounded-full h-[2rem] w-[2rem] flex items-center justify-center",
                  "bg-white shadow border text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600",
                )}
              >
                <IoClose size={20} className="pointer-events-none" />
              </button>
            </div>
            {DRAG_HANDLER_POSITIONS.map((pos) => (
              <div
                data-ignore-ev
                onMouseDownCapture={(ev) => {
                  dirRef.current = pos;
                  ev.preventDefault();
                }}
                onTouchStartCapture={(ev) => {
                  dirRef.current = pos;
                  ev.preventDefault();
                }}
                key={pos}
                className={clsx(
                  "absolute bg-gray-900/70 rounded-sm -m-0.5",
                  pos.includes("-") && "w-3 h-3",
                  ["TOP", "BOTTOM"].includes(pos) &&
                    "w-1/3 h-3 cursor-n-resize",
                  ["LEFT", "RIGHT"].includes(pos) &&
                    "w-3 h-1/3 cursor-e-resize",
                  pos === "TOP" && "top-0 left-1/2 -translate-x-1/2",
                  pos === "BOTTOM" && "bottom-0 left-1/2 -translate-x-1/2",
                  pos === "LEFT" && "left-0 top-1/2 -translate-y-1/2",
                  pos === "RIGHT" && "right-0 top-1/2 -translate-y-1/2",
                  pos.includes("TOP-") && "top-0",
                  pos.includes("BOTTOM-") && "bottom-0",
                  pos.includes("-LEFT") && "left-0",
                  pos.includes("-RIGHT") && "right-0",
                  ["TOP-LEFT", "BOTTOM-RIGHT"].includes(pos) &&
                    "cursor-nw-resize",
                  ["TOP-RIGHT", "BOTTOM-LEFT"].includes(pos) &&
                    "cursor-ne-resize",
                )}
              ></div>
            ))}
          </div>
        </div>
      )}
      <motion.button
        className={clsx(
          "pointer-events-auto rounded-full absolute bottom-[1rem] right-[1rem] xl:bottom-[2rem] xl:left-[2rem] h-[4rem] w-[4rem] z-[9999] ",
          " shadow",
          !toggled &&
            "bg-gray-700 text-gray-50  hover:bg-gray-900 border border-gray-700",
          toggled &&
            "bg-emerald-800 text-emerald-50 hover:bg-emerald-900 border border-emerald-700",
        )}
        animate={
          toggled
            ? { scale: [1.0, 1.25], rotate: "-90deg" }
            : { scale: [1.25, 1.0], rotate: "90deg" }
        }
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => {
          if (toggled) {
            selRef.current = undefined;
          } else {
            setTextSelPos(undefined);
          }
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

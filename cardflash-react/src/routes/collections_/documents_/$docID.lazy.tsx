import Card from "@/components/Card";
import FlashCardEditor from "@/components/FlashCardEditor";
import PDFViewer from "@/components/pdf/PDFViewer";
import { AddContentFunction } from "@/components/pdf/addContentFunction";
import { SourceLinkAttributes } from "@/components/simple-editor/SourceLink";
import AlertHelper from "@/components/ui/AlertHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18nContext } from "@/i18n/i18n-react";
import { PDFViewerApplication, RenderingStates } from "@/lib/pdf-types";
import {
  Flashcard,
  PDFDocument,
  createFlashcard,
  deleteFlashcard,
  deletePDFDocument,
  getPDFDocument,
  listFlashcardsForDocumentID,
  updateFlashcard,
  updatePDFDocument,
} from "@/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import type { Editor } from "@tiptap/core";
import clsx from "clsx";
import { motion } from "framer-motion";
import { PDFPageView } from "pdfjs-dist/types/web/pdf_page_view";
import { useEffect, useRef, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";

export const Route = createLazyFileRoute("/collections/documents/$docID")({
  component: SingleDocPage,
});

function SingleDocPage() {
  const { docID } = Route.useParams();
  const { source } = Route.useSearch();
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
      <div className="w-full h-full">
        <SingleDocumentView
          doc={data.doc}
          objectURL={data.objectURL}
          docID={docID}
          source={source}
        />
      </div>
    </>
  );
}

function SingleDocumentView({
  objectURL,
  docID,
  doc,
  source,
}: {
  objectURL: string;
  docID: string;
  doc: PDFDocument;
  source?: SourceLinkAttributes | undefined;
}) {
  const { LL } = useI18nContext();
  const [activeTab, setActiveTab] = useState<
    "pdf-viewer" | "cards" | "combined"
  >(window.innerWidth > 1024 ? "combined" : "pdf-viewer");
  const flashcardEditorRef = useRef<{
    addContent: AddContentFunction;
    replaceContent: (front: string, back: string) => unknown;
    getEditors: () => { front: Editor; back: Editor } | undefined;
  }>(null);

  const pdfViewerRef = useRef<{
    getPDFApplication: () => PDFViewerApplication | undefined;
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

  const addFlashcardMut = useMutation({
    mutationFn: createFlashcard,
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({
        queryKey: [`pdf-document-${c.pdfDocumentID}-cards`],
      });
    },
  });

  const updateFlashcardMut = useMutation({
    mutationFn: updateFlashcard,
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({
        queryKey: [`pdf-document-${c.pdfDocumentID}-cards`],
      });
    },
  });

  const [cardsFlipped, setCardsFlipped] = useState<Record<string, boolean>>({});

  const [isEditingCard, setIsEditingCard] = useState<Flashcard>();

  const visitSource = async (source: SourceLinkAttributes) => {
    setActiveTab((tab) => {
      if (tab === "cards") {
        return window.innerWidth > 1024 ? "combined" : "pdf-viewer";
      } else {
        return tab;
      }
    });
    const pdfApplication = pdfViewerRef.current?.getPDFApplication();
    if (pdfApplication) {
      pdfApplication.page = source.page + 1;

      let tries = 0;
      while (
        pdfApplication.pdfViewer.getPageView(source.page)?.renderingState !=
        RenderingStates.FINISHED
      ) {
        await new Promise((res) => setTimeout(res, 100));
        tries++;
        if (tries > 100) {
          return;
        }
      }
      const page: PDFPageView = pdfApplication.pdfViewer.getPageView(
        source.page,
      );
      const newCanvas = page.canvas!.ownerDocument.createElement("canvas");
      newCanvas.style.position = "absolute";
      newCanvas.style.width = "100%";
      newCanvas.style.height = "100%";
      newCanvas.style.top = "0";
      newCanvas.style.left = "0";
      page.canvas?.parentElement?.appendChild(newCanvas);
      newCanvas.width = page.canvas!.width;
      newCanvas.height = page.canvas!.height;
      const [realX, realY] = page.viewport.convertToViewportPoint(
        source.x,
        source.y,
      ) as [number, number];

      const [realX2, realY2] = page.viewport.convertToViewportPoint(
        source.x + source.width,
        source.y + source.height,
      ) as [number, number];
      const ctx = newCanvas!.getContext("2d")!;
      ctx.fillStyle = "#3afc2810";
      ctx.strokeStyle = "#3afc2860";
      ctx.lineWidth = 2;
      const factorX = page.outputScale?.sx ?? 1;
      const factorY = page.outputScale?.sy ?? 1;
      ctx.roundRect(
        factorX * realX,
        factorY * realY,
        factorX * (realX2 - realX),
        factorY * (realY2 - realY),
        5,
      );
      ctx.stroke();
      ctx.fill();

      setTimeout(() => {
        ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);
        newCanvas.height = 1;
        newCanvas.width = 1;
        page!.canvas?.parentElement?.removeChild(newCanvas);
      }, 1.5 * 1000);
    }
  };

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
      className="w-full h-full px-0 mx-0 flex flex-col mt-0"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full pb-4">
        <div className="flex justify-start w-fit mr-auto">
          <Link
            to="/collections/$collectionID"
            params={{ collectionID: doc.collectionID }}
          >
            <Button variant="ghost">
              <div className="flex gap-x-2 items-center">
                <IoArrowBack />
                <span className="hidden xl:inline-block">{LL.GO_BACK()}</span>
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
        <div className="flex justify-end w-fit ml-auto flex-wrap">
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
          "w-full h-full grid overflow-hidden",
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
              onLoaded={async () => {
                if (source) {
                  console.log(source);
                  visitSource(source);
                }
              }}
              ref={pdfViewerRef}
              documentID={docID}
              defaultPage={source?.page}
              file={objectURL}
              addContent={(content, source, side) => {
                if (flashcardEditorRef.current) {
                  flashcardEditorRef.current!.addContent(content, source, side);
                }
              }}
            />
          )}
        </motion.div>
        <motion.div
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          layout
          className={clsx(
            "w-full h-full overflow-auto lg:overflow-hidden",
            activeTab === "pdf-viewer" && "hidden",
            activeTab !== "pdf-viewer" && "flex flex-col",
          )}
        >
          <div className="pb-4">
            <FlashCardEditor
              ref={flashcardEditorRef}
              doc={doc}
              visitSource={visitSource}
            />
            <div className="min-h-[4rem]">
              {isEditingCard !== undefined && (
                <div>
                  <Button
                    className="block mx-auto mt-4"
                    size="lg"
                    onClick={() => {
                      const editors = flashcardEditorRef.current?.getEditors();
                      if (editors) {
                        updateFlashcardMut.mutate({
                          ...isEditingCard,
                          front: editors.front.getHTML(),
                          back: editors.back.getHTML(),
                        });
                        editors.front.commands.clearContent();
                        editors.back.commands.clearContent();
                        setIsEditingCard(undefined);
                      }
                    }}
                  >
                    {LL.CARD_EDITOR.SAVE()}
                  </Button>
                  <Button
                    variant="outline"
                    className="block mx-auto mt-1"
                    onClick={() => {
                      const editors = flashcardEditorRef.current?.getEditors();
                      if (editors) {
                        setIsEditingCard(undefined);
                        editors.front.commands.clearContent();
                        editors.back.commands.clearContent();
                      }
                    }}
                  >
                    {LL.CARD_EDITOR.CANCEL_EDITING()}
                  </Button>
                </div>
              )}
              {isEditingCard === undefined && (
                <Button
                  className="block mx-auto mt-4"
                  size="lg"
                  onClick={async () => {
                    if (flashcardEditorRef.current) {
                      const editors = flashcardEditorRef.current.getEditors();
                      if (editors?.front && editors?.back) {
                        addFlashcardMut.mutate({
                          type: "simple",
                          pdfDocumentID: docID,
                          pdfPage: 0,
                          front: editors.front.getHTML(),
                          back: editors.back.getHTML(),
                        });
                        editors.front.commands.clearContent();
                        editors.back.commands.clearContent();
                      }
                    }
                  }}
                >
                  {LL.ADD()}
                </Button>
              )}
            </div>
          </div>
          {cardData.cards.length > 0 && (
            <div className=" w-full py-2 h-fit lg:h-full lg:overflow-auto">
              {/* <h2 className="text-xl font-medium text-center mt-8">{LL.CARDS()}</h2> */}
              <div className="flex flex-col items-center gap-4">
                {cardData.cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="h-64 sm:h-52 md:h-60 xl:h-[21rem] w-[25rem] mx-auto max-w-full sm:mx-auto sm:w-80md:w-96 xl:w-[32rem] relative"
                    onClick={() => {
                      setCardsFlipped((flipped) => {
                        const newFlipped = { ...flipped };
                        if (newFlipped[card.id] === true) {
                          newFlipped[card.id] = false;
                        } else {
                          newFlipped[card.id] = true;
                        }
                        return newFlipped;
                      });
                    }}
                  >
                    <Button
                      title={LL.DELETE()}
                      className="absolute z-50 bottom-2 right-12 text-red-500"
                      size="icon"
                      variant="outline"
                      onClick={async (ev) => {
                        ev.stopPropagation();
                        await deleteFlashcard(card.id);
                        setCardsFlipped((flipped) => {
                          const newFlipped = { ...flipped };
                          delete newFlipped[card.id];
                          return newFlipped;
                        });
                        if (isEditingCard?.id === card.id) {
                          setIsEditingCard(undefined);
                        }
                        await queryClient.invalidateQueries({
                          queryKey: [`pdf-document-${docID}-cards`],
                        });
                      }}
                    >
                      <FiTrash />
                    </Button>

                    <Button
                      title={LL.EDIT()}
                      className="absolute z-50 bottom-2 right-2"
                      size="icon"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (flashcardEditorRef.current) {
                          flashcardEditorRef.current.replaceContent(
                            card.front,
                            card.back,
                          );
                          setIsEditingCard(card);
                        }
                      }}
                    >
                      <FiEdit />
                    </Button>
                    <Card
                      visitSource={visitSource}
                      card={card}
                      index={i}
                      flipped={cardsFlipped[card.id] === true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Tabs>
  );
}

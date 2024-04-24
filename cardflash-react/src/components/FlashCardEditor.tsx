import { useI18nContext } from "@/i18n/i18n-react";
import { PDFDocument, createFlashcard } from "@/lib/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Editor } from "@tiptap/core";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import SimpleEditor from "./SimpleEditor";
import { AddContentFunction } from "./pdf/addContentFunction";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export const FlashCardEditor = forwardRef<
  { addContent: AddContentFunction },
  { doc: PDFDocument }
>((props, ref) => {
  const pdfInfoRef = useRef<{ pdfPage: number }>();
  const queryClient = useQueryClient();

  const addFlashcardMut = useMutation({
    mutationFn: createFlashcard,
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({
        queryKey: [`pdf-document-${c.pdfDocumentID}-cards`],
      });
    },
  });

  const frontEditorRef = useRef<Editor>();
  const backEditorRef = useRef<Editor>();
  const { LL } = useI18nContext();
  const addContent = useMemo<AddContentFunction>(
    () => (content, pdfInfo, side) => {
      pdfInfoRef.current = pdfInfo;
      const editor =
        side === "front" ? frontEditorRef.current! : backEditorRef.current!;
      if (content.type === "image") {
        editor.commands.setImage({
          src: content.dataURL,
          title: "Image",
          alt: "Invert",
        });
      } else if (content.type === "text") {
        editor.commands.insertContent({
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: content.text,
            },
          ],
        });
      }
    },
    [],
  );
  useImperativeHandle(ref, () => ({ addContent }), [addContent]);
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-1 w-full justify-center items-center lg:items-start max-w-xl lg:max-w-5xl mx-auto">
        <div className="h-full w-full">
          <Label className="mr-auto text-lg">{LL.CARD_EDITOR.FRONT()}</Label>
          <SimpleEditor
            editorCallback={(ed) => (frontEditorRef.current = ed)}
          />
        </div>

        <div className="h-full w-full">
          <Label className="mr-auto mt-2 lg:mt-0 text-lg">
            {LL.CARD_EDITOR.BACK()}
          </Label>
          <SimpleEditor editorCallback={(ed) => (backEditorRef.current = ed)} />
        </div>
      </div>
      <Button
        className="block mx-auto mt-4"
        size="lg"
        onClick={async () => {
          addFlashcardMut.mutate({
            type: "simple",
            pdfDocumentID: props.doc.id,
            pdfPage: pdfInfoRef.current
              ? pdfInfoRef.current.pdfPage
              : undefined,
            front: frontEditorRef.current!.getHTML(),
            back: backEditorRef.current!.getHTML(),
          });
          frontEditorRef.current!.commands.clearContent();
          backEditorRef.current!.commands.clearContent();
        }}
      >
        {LL.ADD()}
      </Button>
      <Button
        className="block mx-auto mt-4"
        size="lg"
        onClick={async () => {
          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then((persistent) => {
              if (persistent) {
                Array(1000)
                  .fill(0)
                  .forEach((_, i) => {
                    addFlashcardMut.mutate({
                      type: "simple",
                      pdfDocumentID: props.doc.id,
                      pdfPage: pdfInfoRef.current
                        ? pdfInfoRef.current.pdfPage
                        : undefined,
                      front:
                        frontEditorRef.current!.getHTML() + `<br><p>${i}</p>`,
                      back:
                        backEditorRef.current!.getHTML() + `<br><p>${i}</p>`,
                    });
                  });
                console.log("added 1000 cards!");
                //   frontEditorRef.current!.commands.clearContent();
                // backEditorRef.current!.commands.clearContent();
              } else {
                console.log(
                  "Storage may be cleared by the UA under storage pressure.",
                );
              }
            });
          }
        }}
      >
        1000 x {LL.ADD()}
      </Button>
    </div>
  );
});

export default FlashCardEditor;

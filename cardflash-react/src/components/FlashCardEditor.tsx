import { useI18nContext } from "@/i18n/i18n-react";
import { PDFDocument } from "@/lib/storage";
import type { Editor, Content } from "@tiptap/core";
import { generateJSON } from "@tiptap/react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import SimpleEditor from "./SimpleEditor";
import { AddContentFunction } from "./pdf/addContentFunction";
import { Label } from "./ui/label";
import { SourceLinkAttributes } from "./simple-editor/SourceLink";

export const FlashCardEditor = forwardRef<
  {
    addContent: AddContentFunction;
    replaceContent: (front: string, back: string) => unknown;
    getEditors: () => { front: Editor; back: Editor } | undefined;
  },
  { doc: PDFDocument; visitSource?: (source: SourceLinkAttributes) => unknown }
>((props, ref) => {
  const frontEditorRef = useRef<Editor>();
  const backEditorRef = useRef<Editor>();
  const { LL } = useI18nContext();
  const addContent = useCallback<AddContentFunction>(
    (content, source, side) => {
      const editor =
        side === "front" ? frontEditorRef.current! : backEditorRef.current!;
      editor.commands.deleteSelection();
      let editorContent: Content = [];
      if (content.type === "image") {
        editorContent = [
          {
            type: "image",
            attrs: {
              src: content.dataURL,
              title: "Image",
              alt: "Invert",
            },
          },
          { type: "sourceLink", attrs: source },
        ];
      } else if (content.type === "text") {
        editorContent = {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: content.text,
            },
            { type: "sourceLink", attrs: source },
          ],
        };
      }
      if (!editor.isEmpty) {
        editor.commands.insertContent(editorContent, { updateSelection: true });
      } else {
        editor.commands.setContent(editorContent, true);
      }
    },
    [],
  );

  const replaceContent = useMemo(
    () => (front: string, back: string) => {
      if (frontEditorRef.current && backEditorRef.current) {
        const frontDoc = generateJSON(
          front,
          frontEditorRef.current.extensionManager.extensions,
        );
        const backDoc = generateJSON(
          back,
          backEditorRef.current.extensionManager.extensions,
        );
        frontEditorRef.current.commands.setContent(frontDoc);
        backEditorRef.current.commands.setContent(backDoc);
      }
    },
    [],
  );

  const getEditors = useMemo(
    () => () => {
      if (frontEditorRef.current && backEditorRef.current) {
        return { front: frontEditorRef.current, back: backEditorRef.current };
      } else {
        return undefined;
      }
    },
    [],
  );

  useImperativeHandle(ref, () => ({ addContent, replaceContent, getEditors }), [
    addContent,
    replaceContent,
    getEditors,
  ]);
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-1 w-full justify-center items-center lg:items-start max-w-xl lg:max-w-5xl mx-auto px-2">
        <div className="h-full w-full">
          <Label className="mx-auto text-xl w-fit block mb-1">
            {LL.CARD_EDITOR.FRONT()}
          </Label>
          <SimpleEditor
            visitSource={props.visitSource}
            editorCallback={(ed) => (frontEditorRef.current = ed)}
          />
        </div>

        <div className="h-full w-full">
          <Label className="mx-auto text-xl w-fit block mb-1">
            {LL.CARD_EDITOR.BACK()}
          </Label>
          <SimpleEditor
            visitSource={props.visitSource}
            editorCallback={(ed) => (backEditorRef.current = ed)}
          />
        </div>
      </div>
    </div>
  );
});

export default FlashCardEditor;

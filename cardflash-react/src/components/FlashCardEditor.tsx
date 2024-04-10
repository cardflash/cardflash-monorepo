import { CardContext } from "@/card-context";
import { useI18nContext } from "@/i18n/i18n-react";
import type { Editor } from "@tiptap/core";
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import SimpleEditor from "./SimpleEditor";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { AddContentFunction } from "./pdf/addContentFunction";

interface FlashCardEditor {}
export const FlashCardEditor = forwardRef<
  { addContent: AddContentFunction },
  { activeSide: string }
>((props, ref) => {
  const { cards, updateCards } = useContext(CardContext);
  const frontEditorRef = useRef<Editor>();
  const backEditorRef = useRef<Editor>();
  const { LL } = useI18nContext();
  const addContent = useMemo<AddContentFunction>(
    () => (content) => {
      const editor =
        props.activeSide === "front"
          ? frontEditorRef.current!
          : backEditorRef.current!;
      console.log({ content, editor });
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
    [props.activeSide],
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
        className="block mx-auto mt-4 mb-12"
        size="lg"
        onClick={async () => {
          updateCards([
            {
              id: Date.now(),
              front: frontEditorRef.current!.getHTML(),
              back: backEditorRef.current!.getHTML(),
            },
            ...cards,
          ]);
          frontEditorRef.current!.commands.clearContent();
          backEditorRef.current!.commands.clearContent();
        }}
      >
        {LL.ADD()}
      </Button>
    </div>
  );
});

export default FlashCardEditor;

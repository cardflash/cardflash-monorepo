import { CardContext } from "@/card-context";
import { BlockNoteEditor, DefaultBlockSchema } from "@blocknote/core";
import { useContext, useRef } from "react";
import BlockEditor from "./BlockEditor";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function FlashCardEditor() {
  const { cards, updateCards } = useContext(CardContext);
  const frontEditorRef = useRef<BlockNoteEditor<DefaultBlockSchema>>();
  const backEditorRef = useRef<BlockNoteEditor<DefaultBlockSchema>>();
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-1 w-full justify-center items-center max-w-xl mx-auto">
        <div className="h-full w-full">
          <Label className="mr-auto text-lg">Front</Label>
          <BlockEditor editorCallback={(ed) => (frontEditorRef.current = ed)} />
        </div>

        <div className="h-full w-full">
          <Label className="mr-auto mt-2 lg:mt-0 text-lg">Back</Label>
          <BlockEditor editorCallback={(ed) => (backEditorRef.current = ed)} />
        </div>
      </div>
      <Button
        className="block mx-auto mt-4"
        size="lg"
        onClick={async () => {
          updateCards([
            {
              id: Date.now(),
              front: await frontEditorRef.current?.blocksToHTMLLossy(),
              back: await backEditorRef.current?.blocksToHTMLLossy(),
            },
            ...cards,
          ]);
        }}
      >
        Add
      </Button>
    </div>
  );
}

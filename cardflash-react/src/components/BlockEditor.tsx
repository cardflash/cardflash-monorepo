import { BlockNoteEditor, DefaultBlockSchema } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect } from "react";

export default function BlockEditor(props: {
  editorCallback?: (editor: BlockNoteEditor<DefaultBlockSchema>) => unknown;
}) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({});

  useEffect(() => {
    if (props.editorCallback) {
      props.editorCallback(editor);
    }
  }, [editor, props]);
  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} className="w-full h-full" />;
}

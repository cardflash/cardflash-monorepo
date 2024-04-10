import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./simple-editor/MenuBar";
import { MathExtension } from "@aarkue/tiptap-math-extension";
import "katex/dist/katex.min.css";

export default function SimpleEditor(props: {
  editorCallback?: (editor: Editor) => unknown;
}) {
  const editor = useEditor({
    onCreate: (args) => {
      if (props.editorCallback) {
        props.editorCallback(args.editor);
      }
    },
    extensions: [
      StarterKit.configure(),
      Highlight,
      TaskList,
      TaskItem,
      Image.configure({
        allowBase64: true,
      }),
      MathExtension.configure({
        evaluation: false,
        addInlineMath: true,
        katexOptions: {},
      }),
    ],
  });

  return (
    <div className="editor">
      {editor && <MenuBar editor={editor} />}
      <EditorContent className="editor-prose" editor={editor} />
    </div>
  );
}

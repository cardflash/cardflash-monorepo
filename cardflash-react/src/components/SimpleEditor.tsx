import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./simple-editor/MenuBar";
import { MathExtension } from "@aarkue/tiptap-math-extension";
import Link from "@tiptap/extension-link";
import "katex/dist/katex.min.css";
import { SourceLink, SourceLinkAttributes } from "./simple-editor/SourceLink";
import clsx from "clsx";
import { useEffect } from "react";

export default function SimpleEditor(props: {
  editorCallback?: (editor: Editor) => unknown;
  visitSource?: (source: SourceLinkAttributes) => unknown;
  editable?: boolean;
  content?: string;
}) {
  const editor = useEditor({
    onCreate: (args) => {
      if (props.editorCallback) {
        props.editorCallback(args.editor);
      }
    },
    editable: props.editable ?? true,
    content: props.content,
    extensions: [
      StarterKit.configure(),
      Highlight,
      Link.configure({
        HTMLAttributes: {
          rel: "",
          target: null,
        },
      }),
      SourceLink.configure({
        visitSource: props.visitSource,
      }),
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

  useEffect(() => {
    if (!props.editable && props.content) {
      editor?.commands.setContent(props.content);
    }
  }, [editor?.commands, props.content, props.editable]);

  return (
    <div className="editor">
      {editor && props.editable !== false && <MenuBar editor={editor} />}
      <EditorContent
        className={clsx(
          "editor-prose",
          props.editable !== false && "editor-editable",
        )}
        editor={editor}
      />
    </div>
  );
}

import { MathExtension } from "@aarkue/tiptap-math-extension";
import { Editor } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import "katex/dist/katex.min.css";
import { useLayoutEffect } from "react";
import MenuBar from "./simple-editor/MenuBar";
import { SourceLink, SourceLinkAttributes } from "./simple-editor/SourceLink";

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

  useLayoutEffect(() => {
    if (!props.editable && props.content) {
      editor?.commands.setContent(props.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.content, props.editable]);

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

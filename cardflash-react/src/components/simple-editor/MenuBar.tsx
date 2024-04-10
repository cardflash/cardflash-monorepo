import type { Editor } from "@tiptap/react";

import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BsHighlighter, BsParagraph } from "react-icons/bs";
import { FiBold, FiCode, FiItalic } from "react-icons/fi";
import { IoArrowRedo, IoArrowUndo, IoCheckbox } from "react-icons/io5";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { PiCodeBlock } from "react-icons/pi";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function MenuBar({ editor }: { editor: Editor }) {
  const items = [
    {
      icon: FiBold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: FiItalic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    // {
    //   icon: PiTextStrikethrough,
    //   title: 'Strike',
    //   action: () => editor.chain().focus().toggleStrike().run(),
    //   isActive: () => editor.isActive('strike'),
    // },
    {
      icon: FiCode,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      icon: BsHighlighter,
      title: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      type: "divider",
    },
    {
      icon: LuHeading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: LuHeading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: BsParagraph,
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      icon: AiOutlineUnorderedList,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: AiOutlineOrderedList,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: IoCheckbox,
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      icon: PiCodeBlock,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    // {
    //   type: 'divider',
    // },
    // {
    //   icon: 'double-quotes-l',
    //   title: 'Blockquote',
    //   action: () => editor.chain().focus().toggleBlockquote().run(),
    //   isActive: () => editor.isActive('blockquote'),
    // },
    // {
    //   icon: 'separator',
    //   title: 'Horizontal Rule',
    //   action: () => editor.chain().focus().setHorizontalRule().run(),
    // },
    // {
    //   type: 'divider',
    // },
    // {
    //   icon: 'text-wrap',
    //   title: 'Hard Break',
    //   action: () => editor.chain().focus().setHardBreak().run(),
    // },
    // {
    //   icon: 'format-clear',
    //   title: 'Clear Format',
    //   action: () => editor.chain().focus().clearNodes().unsetAllMarks()
    //     .run(),
    // },
    {
      type: "divider",
    },
    {
      icon: IoArrowUndo,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: IoArrowRedo,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="mb-2">
      <ToggleGroup
        className="flex flex-wrap gap-x-1"
        value={items
          .filter((item) => item.isActive && item.isActive())
          .map((item) => item.title!)}
        type="multiple"
      >
        {items.map((item, index) =>
          item.type === "divider" ? (
            <div
              className="h-[0.75rem] w-[1px] mx-0.5 bg-slate-300"
              key={index}
            ></div>
          ) : (
            <ToggleGroupItem
              className="h-5 w-5 xl:h-8 xl:w-8 px-0 flex items-center justify-center"
              value={item.title ?? index + ""}
              key={index}
              onClick={item.action}
            >
              {/* {item.icon && item.icon({})} */}
              {item.icon && <item.icon className="h-3 w-3 xl:h-5 xl:w-5" />}
            </ToggleGroupItem>
          ),
        )}
      </ToggleGroup>
    </div>
  );
}

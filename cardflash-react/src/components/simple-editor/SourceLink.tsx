import { Link } from "@tanstack/react-router";
import { mergeAttributes, Node } from "@tiptap/core";
import { Editor, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
const SOURCE_LINK_NODE_NAME = "sourceLink";
export type SourceLinkAttributes = {
  documentID: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
export const SourceLink: Node<{
  visitSource?: (linkProps: SourceLinkAttributes) => unknown;
}> = Node.create({
  name: SOURCE_LINK_NODE_NAME,
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      visitSource: (linkProps: SourceLinkAttributes) => {
        console.warn("No visitSource function option set!", linkProps);
      },
    };
  },

  addAttributes() {
    return {
      documentID: {
        default: "",
      },
      page: {
        default: 0,
      },
      x: {
        default: 0,
      },
      y: {
        default: 0,
      },
      width: {
        default: 0,
      },
      height: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: SOURCE_LINK_NODE_NAME,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [SOURCE_LINK_NODE_NAME, mergeAttributes(HTMLAttributes)];
  },
  // renderHTML({ node, HTMLAttributes }) {
  //   const attrs = node.attrs as SourceLinkAttributes;
  //   return [
  //     SOURCE_LINK_NODE_NAME,
  //     mergeAttributes(
  //       {
  //         class:
  //           "not-prose border rounded inline-flex items-center justify-center w-[1.5rem] h-[1.5rem] text-xs cursor-pointer hover:bg-gray-100 opacity-40 hover:opacity-100",
  //       },
  //       HTMLAttributes,
  //     ),
  //     "a",
  //     {
  //       href: `/collections/documents/${attrs.documentID}?page=${attrs.page}&x=${attrs.x}&y=${attrs.y}&width=${attrs.width}&height=${attrs.height}`,
  //     },
  //     "📌",
  //   ];
  // },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});

function Component(props: {
  editor: Editor;
  updateAttributes: (attrs: SourceLinkAttributes) => unknown;
  node: { attrs: SourceLinkAttributes };
  extension: typeof SourceLink;
}) {
  return (
    <NodeViewWrapper
      as="button"
      className="not-prose border rounded flex items-center justify-center w-[1.5rem] h-[1.5rem] text-xs cursor-pointer hover:bg-gray-100 opacity-40 hover:opacity-100"
      onClick={(ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (props.extension.options.visitSource) {
          props.extension.options.visitSource(props.node.attrs);
        }
      }}
    >
      {props.extension.options.visitSource === undefined && (
        <Link
          className="w-full h-full flex items-center justify-center"
          target="_blank"
          to="/collections/documents/$docID"
          params={{ docID: props.node.attrs.documentID }}
          search={{ source: { ...props.node.attrs } }}
        >
          📌
        </Link>
      )}
      {props.extension.options.visitSource !== undefined && "📌"}
    </NodeViewWrapper>
  );
}

import { SourceLinkAttributes } from "../simple-editor/SourceLink";

export type AddableContent =
  | { type: "image"; dataURL: string }
  | { type: "text"; text: string };
export type AddContentFunction = (
  content: AddableContent,
  source: SourceLinkAttributes,
  side: "front" | "back",
) => unknown;

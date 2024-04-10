export type AddContentFunction = (
  content: { type: "image"; dataURL: string } | { type: "text"; text: string },
) => unknown;

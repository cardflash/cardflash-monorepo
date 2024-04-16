export type AddableContent =
  | { type: "image"; dataURL: string }
  | { type: "text"; text: string };
export type AddContentFunction = (
  content: AddableContent,
  pdfInfo: { pdfDocumentID: string; pdfPage: number },
  side: "front" | "back",
) => unknown;

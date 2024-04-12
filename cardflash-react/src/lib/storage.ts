import { get, set, keys, getMany } from "idb-keyval";
const IDB_KEY_PREFIX = "cardflash-react-";
export type BaseSavedDocument = { id: string; lastUpdated: number };

const ATTACHMENT_KEY_PREFIX = IDB_KEY_PREFIX + "attachment-";

const PDF_DOC_KEY_PREFIX = IDB_KEY_PREFIX + "pdfdoc-";
export type PDFDocument = {
  attachmentID: string;
  name: string;
  tags: string[];
} & BaseSavedDocument;

export async function createPDFDocument(
  pdfDoc: Omit<PDFDocument, "attachmentID" | "id" | "lastUpdated">,
  pdfBlob: Blob,
) {
  const attachmentID =
    ATTACHMENT_KEY_PREFIX +
    Math.round(Math.random() * 10000) +
    "-" +
    Date.now();
  await set(attachmentID, pdfBlob);
  const doc: PDFDocument = {
    ...pdfDoc,
    id:
      PDF_DOC_KEY_PREFIX + Math.round(Math.random() * 10000) + "-" + Date.now(),
    attachmentID,
    lastUpdated: Date.now(),
  };
  await set(doc.id, doc);
  return doc;
}

export async function listPDFDocuments() {
  const docs = await getMany<PDFDocument>(
    (await keys()).filter((k) => k.toString().startsWith(PDF_DOC_KEY_PREFIX)),
  );
  return docs;
}

export async function getPDFDocument(
  id: string,
): Promise<{ doc: PDFDocument; pdfBlob: Blob }> {
  const doc = await get<PDFDocument>(id);
  console.log({ doc });
  if (!doc) {
    throw Error("Document not found: " + id);
  }
  const pdfBlob = await get<Blob>(doc.attachmentID);
  if (!pdfBlob) {
    throw Error("Blob not found: " + doc.attachmentID);
  }
  return { doc, pdfBlob };
}

import { get, set, keys, getMany } from "idb-keyval";
const IDB_KEY_PREFIX = "cardflash-react-";
export type BaseSavedDocument = {
  id: string;
  lastUpdated: number;
  created: number;
};

const ATTACHMENT_KEY_PREFIX = IDB_KEY_PREFIX + "attachment-";

const PDF_DOC_KEY_PREFIX = IDB_KEY_PREFIX + "pdfdoc-";
export type PDFDocument = {
  attachmentID: string;
  name: string;
  tags: string[];
} & BaseSavedDocument;

export async function createPDFDocument(data: {
  pdfDoc: Omit<PDFDocument, "attachmentID" | "id" | "lastUpdated" | "created">;
  pdfBlob: Blob;
}) {
  const attachmentID =
    ATTACHMENT_KEY_PREFIX +
    Math.round(Math.random() * 10000) +
    "-" +
    Date.now();
  await set(attachmentID, data.pdfBlob);
  const doc: PDFDocument = {
    ...data.pdfDoc,
    id:
      PDF_DOC_KEY_PREFIX + Math.round(Math.random() * 10000) + "-" + Date.now(),
    attachmentID,
    lastUpdated: Date.now(),
    created: Date.now(),
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

export async function updatePDFDocument(pdfDoc: PDFDocument) {
  pdfDoc.lastUpdated = Date.now();
  await set(pdfDoc.id, pdfDoc);
  return pdfDoc;
}

const CARD_KEY_PREFIX = IDB_KEY_PREFIX + "card-";
export type Flashcard = {
  type: "simple";
  front: string;
  back: string;
  pdfDocumentID: string | undefined;
  pdfPage: number | undefined;
  scheduling: { lastReview: number; score: number };
} & BaseSavedDocument;

export async function createFlashcard(
  cardInput: Omit<Flashcard, "id" | "lastUpdated" | "created" | "scheduling">,
) {
  const card: Flashcard = {
    ...cardInput,
    id: CARD_KEY_PREFIX + Math.round(Math.random() * 10000) + "-" + Date.now(),
    lastUpdated: Date.now(),
    created: Date.now(),
    scheduling: { lastReview: 0, score: 0 },
  };
  await set(card.id, card);
  return card;
}

export async function listFlashcards() {
  const docs = await getMany<Flashcard>(
    (await keys()).filter((k) => k.toString().startsWith(CARD_KEY_PREFIX)),
  );
  return docs;
}

export async function getFlashcard(id: string): Promise<Flashcard> {
  const card = await get<Flashcard>(id);
  if (!card) {
    throw Error("Flashcard not found: " + id);
  }
  return card;
}

export async function updateFlashcard(card: Flashcard) {
  await set(card.id, card);
  return card;
}

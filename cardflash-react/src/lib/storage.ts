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
  collectionID: string;
} & BaseSavedDocument;

export async function createPDFDocument(data: {
  pdfDoc: Omit<PDFDocument, "attachmentID" | "id" | "lastUpdated" | "created">;
  pdfBlob: Blob;
}) {
  const db = await initDB();
  const attachmentID =
    ATTACHMENT_KEY_PREFIX +
    Math.round(Math.random() * 10000) +
    "-" +
    Date.now();
  await db.add("attachments", data.pdfBlob, attachmentID);
  const doc: PDFDocument = {
    ...data.pdfDoc,
    id:
      PDF_DOC_KEY_PREFIX + Math.round(Math.random() * 10000) + "-" + Date.now(),
    attachmentID,
    lastUpdated: Date.now(),
    created: Date.now(),
  };
  await db.add("documents", doc);
  return doc;
}

export async function listPDFDocumentsForCollection(collectionID: string) {
  const db = await initDB();
  const docs = await db.getAllFromIndex(
    "documents",
    "by-collectionID",
    collectionID,
  );
  return docs;
}

export async function getPDFDocument(
  id: string,
): Promise<{ doc: PDFDocument; pdfBlob: Blob }> {
  const db = await initDB();
  const doc = await db.get("documents", id);
  if (!doc) {
    throw Error("Document not found: " + id);
  }
  const pdfBlob = await db.get("attachments", doc.attachmentID);
  if (!pdfBlob) {
    throw Error("Blob not found: " + doc.attachmentID);
  }
  return { doc, pdfBlob };
}

export async function updatePDFDocument(pdfDoc: PDFDocument) {
  const db = await initDB();
  const newPDFDoc: PDFDocument = { ...pdfDoc, lastUpdated: Date.now() };
  await db.put("documents", newPDFDoc);
  return newPDFDoc;
}

const CARD_KEY_PREFIX = IDB_KEY_PREFIX + "card-";
export type Flashcard = {
  type: "simple";
  front: string;
  back: string;
  pdfDocumentID: string;
  pdfPage: number | undefined;
  scheduling: { lastReview: number; score: number };
} & BaseSavedDocument;

export async function createFlashcard(
  cardInput: Omit<Flashcard, "id" | "lastUpdated" | "created" | "scheduling">,
) {
  const db = await initDB();
  const card: Flashcard = {
    ...cardInput,
    id: CARD_KEY_PREFIX + Math.round(Math.random() * 10000) + "-" + Date.now(),
    lastUpdated: Date.now(),
    created: Date.now(),
    scheduling: { lastReview: 0, score: 0 },
  };
  await db.add("flashcards", card);
  return card;
}

export async function listFlashcards() {
  const db = await initDB();
  const docs = await db.getAll("flashcards", undefined, undefined);
  return docs;
}

export async function listFlashcardsForDocumentID(documentID: string) {
  const db = await initDB();
  const docs = await db.getAllFromIndex(
    "flashcards",
    "by-pdfDocumentID",
    IDBKeyRange.only(documentID),
  );
  return docs;
}

export async function updateFlashcard(card: Flashcard) {
  const db = await initDB();
  const newCard: Flashcard = { ...card, lastUpdated: Date.now() };
  await db.put("flashcards", newCard);
  return newCard;
}

const COLLECTION_KEY_PREFIX = IDB_KEY_PREFIX + "collection-";
export type Collection = {
  name: string;
  tags: string[];
} & BaseSavedDocument;

export async function createCollection(
  cardInput: Omit<Collection, "id" | "lastUpdated" | "created">,
) {
  const db = await initDB();
  const collection: Collection = {
    ...cardInput,
    id:
      COLLECTION_KEY_PREFIX +
      Math.round(Math.random() * 10000) +
      "-" +
      Date.now(),
    lastUpdated: Date.now(),
    created: Date.now(),
  };
  await db.add("collections", collection);
  return collection;
}

export async function listCollections() {
  const db = await initDB();
  const docs = await db.getAll("collections", undefined, undefined);
  return docs;
}

export async function updateCollection(collection: Collection) {
  const db = await initDB();
  const newCollection: Collection = { ...collection, lastUpdated: Date.now() };
  await db.put("collections", newCollection);
  return newCollection;
}

export async function getCollection(id: string): Promise<Collection> {
  const db = await initDB();
  const collection = await db.get("collections", id);
  if (!collection) {
    throw Error("Collection not found: " + id);
  }
  return collection;
}

export async function deletePDFDocument(id: string): Promise<void> {
  const db = await initDB();
  const keys = await db.getAllKeysFromIndex(
    "flashcards",
    "by-pdfDocumentID",
    id,
  );
  await Promise.all(keys.map((k) => db.delete("flashcards", k)));
  await db.delete("documents", id);
}

export async function deleteCollection(id: string): Promise<void> {
  const db = await initDB();
  const keys = await db.getAllKeysFromIndex("documents", "by-collectionID", id);
  await Promise.all(keys.map((k) => deletePDFDocument(k)));
  await db.delete("collections", id);
}

export async function getNumberOfDocsForCollection(
  id: string,
): Promise<number> {
  const db = await initDB();
  const keys = await db.getAllKeysFromIndex("documents", "by-collectionID", id);
  return keys.length;
}

export async function getCountsForCollection(
  id: string,
): Promise<{ numDocs: number; numFlashcards: number }> {
  const db = await initDB();
  const keys = await db.getAllKeysFromIndex("documents", "by-collectionID", id);
  const tx = db.transaction("flashcards");
  const txIndex = tx.store.index("by-pdfDocumentID");
  const flashcardKeys = (
    await Promise.all(keys.map((key) => txIndex.getAllKeys(key)))
  ).flat();
  return { numDocs: keys.length, numFlashcards: flashcardKeys.length };
}

// ---------

import { DBSchema, openDB, type IDBPDatabase } from "idb";

interface CardflashDB extends DBSchema {
  flashcards: {
    value: Flashcard;
    key: string;
    indexes: { "by-pdfDocumentID": string };
  };
  documents: {
    value: PDFDocument;
    key: string;
    indexes: { "by-collectionID": string };
  };
  attachments: {
    value: Blob;
    key: string;
  };
  collections: {
    value: Collection;
    key: string;
  };
}
const initDB = (() => {
  let db: IDBPDatabase<CardflashDB> | undefined;

  async function initDB() {
    if (db === undefined) {
      db = await openDB<CardflashDB>("cardflash-react", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("flashcards")) {
            const flashardStore = db.createObjectStore("flashcards", {
              keyPath: "id",
            });
            flashardStore.createIndex("by-pdfDocumentID", "pdfDocumentID");
          }

          if (!db.objectStoreNames.contains("documents")) {
            const docStore = db.createObjectStore("documents", {
              keyPath: "id",
            });
            docStore.createIndex("by-collectionID", "collectionID");
          }

          if (!db.objectStoreNames.contains("collections")) {
            db.createObjectStore("collections", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("attachments")) {
            db.createObjectStore("attachments");
          }
        },
      });
      return db;
    } else {
      return db;
    }
  }
  return initDB;
})();

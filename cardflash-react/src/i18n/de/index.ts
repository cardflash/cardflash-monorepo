import type { Translation } from "../i18n-types.js";

const de = {
  ROUTES: {
    HOME: "Start",
    DOCUMENTS: "Dokumente",
    COLLECTIONS: "Sammlungen",
    STUDY: "Lernen",
    SETTINGS: "Einstellungen",
  },
  GO_BACK: "Zurück",
  WELCOME: "Willkommen!",
  ADD: "Hinzufügen",
  EDIT: "Bearbeiten",
  DELETE: "Löschen",
  SAVE: "Speichern",
  CANCEL: "Abbrechen",
  NAME: "Name",
  SHUFFLE: "Mischen",
  VIEW_PDF: "PDF Ansehen",
  CARDS: "Karteikarten",
  NUM_CARDS_SCHEDULED: "{0} Karteikarten geplant",
  OF_NUM_CARDS_DONE: "{numDone} von {numTotal} Karteikarten gelernt",
  LANGUAGE: "Sprache",
  LANGUAGE_SELECTOR: "Ausgewählte Sprache",
  STUDY: {
    SHOW_ANSWER: "Antwort anzeigen",
    QUESTION: "Frage",
    ANSWER: "Antwort",
    NO_CARDS: "Keine Karteikarten",
    ANSWER_OPTIONS: {
      AGAIN: "Nochmal",
      HARD: "Schwer",
      GOOD: "Gut",
      EASY: "Einfach",
    },
  },
  ERROR_PAGE: {
    ERROR: "Unerwarteter Fehler",
    RESET: "Zurücksetzen",
    NOT_FOUND: "Seite nicht gefunden",
  },
  COMPONENTS: {
    FILE_DROP_ZONE: {
      CLICK_TO_SELECT: "Datei auswählen",
      OR_DROP: "oder drag-and-drop",
    },
  },
  CARD_EDITOR: {
    FRONT: "Vorderseite",
    BACK: "Rückseite",
  },
  COLLECTIONS: {
    DELETE_COLLECTION_WARNING: "Bist du sicher? Alle Dokumente und Karteikarten in dieser Sammlung werden gelöscht."
  },
  DOCUMENTS: {
    DELETE_DOCUMENTS_WARNING: "Bist du sicher? Das Dokument und alle Karteikarten von diesem Dokument werden gelöscht."
  }
} satisfies Translation;

export default de;

import type { Translation } from "../i18n-types.js";

const de = {
  ROUTES: {
    HOME: "Start",
    DOCUMENTS: "Dokumente",
    STUDY: "Lernen",
    SETTINGS: "Einstellungen",
  },
  WELCOME: "Willkommen!",
  CARDS: "Karteikarten",
  NUM_CARDS_SCHEDULED: "{0} Karteikarten geplant",
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
} satisfies Translation;

export default de;

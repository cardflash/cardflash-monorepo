import type { BaseTranslation } from "../i18n-types.js";

const en = {
  ROUTES: {
    HOME: "Home",
    DOCUMENTS: "Documents",
    STUDY: "Study",
    SETTINGS: "Settings",
  },
  WELCOME: "Welcome!",
  CARDS: "Cards",
  NUM_CARDS_SCHEDULED: "{0} cards scheduled",
  LANGUAGE: "Language",
  LANGUAGE_SELECTOR: "Language Selector",
  STUDY: {
    SHOW_ANSWER: "Show Answer",
    QUESTION: "Question",
    ANSWER: "Answer",
    NO_CARDS: "No cards",
    ANSWER_OPTIONS: {
      AGAIN: "Again",
      HARD: "Hard",
      GOOD: "Good",
      EASY: "Easy",
    },
  },
  ERROR_PAGE: {
    ERROR: "Unexpected Error",
    RESET: "Reset",
    NOT_FOUND: "Not Found",
  },
} satisfies BaseTranslation;

export default en;

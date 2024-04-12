import type { BaseTranslation } from "../i18n-types.js";

const en = {
  ROUTES: {
    HOME: "Home",
    DOCUMENTS: "Documents",
    STUDY: "Study",
    SETTINGS: "Settings",
  },
  GO_BACK: "Back",
  WELCOME: "Welcome!",
  ADD: "Add",
  CARDS: "Cards",
  NUM_CARDS_SCHEDULED: "{0} cards scheduled",
  OF_NUM_CARDS_DONE: "{numDone} of {numTotal} cards done",
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
  COMPONENTS: {
    FILE_DROP_ZONE: {
      CLICK_TO_SELECT: "Click to select a file",
      OR_DROP: "or drag and drop",
    },
  },
  CARD_EDITOR: {
    FRONT: "Front",
    BACK: "Back",
  },
} satisfies BaseTranslation;

export default en;

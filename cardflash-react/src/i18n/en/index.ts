import type { BaseTranslation } from "../i18n-types.js";

const en = {
  ROUTES: {
    HOME: "Home",
    DOCUMENTS: "Documents",
    COLLECTIONS: "Collections",
    STUDY: "Study",
    SETTINGS: "Settings",
  },
  DOCUMENT: "Document",
  COMBINED: "Combined",
  SAMPLE_CARDS: {
    CARD1: {
      front: "<h2>How can I get started and create new flashcards?</h2>",
      back: `<p>To create your first flashcards, follow these steps:
      <ul>
        <li>First, add a <b>new collection</b> <a href=\"/collections\">here</a></li>
        <li>Select the newly created collection and <b>add a PDF document</b> to the collection.</li>
        <li>Click on the added document. You're now in the <b>editor</b> and can <b>design flashcards</b> manually or with image snippets from the PDF.</li>
      </ul>
    </p>
    `,
    },
    CARD2: {
      front:
        "<h2>Why do I need to select a PDF to create flashcards?</h2>",
      back: `<p>In cardflash, <b>flashcards are always directly linked to the source</b> of the information.
      <br/>
      This way, when studying, you can easily read more information or clarify any uncertainties.
      <br/>
      <br/>
      Currently, only PDF files are supported as source material. However, you can also export websites or other sources as PDFs and use them in cardflash this way.</p>
`,
    },
    CARD3: {
      front:
        "<h2>Can I change the interface language?</h2>",
      back: `<p>Sure thing! Head over to the <a href="/settings">settings</a> to change the language.
      <br/>
      Currently, English, German and Traditional Chinese are available.</p>`,
    },
  },
  HOME: {
    WELCOME: "Welcome to",
    NO_CARDS_STORED:
      "Right now, you do not have any collections, documents or flashcards stored.",
    ADD_FIRST_COLLECTION:
      "To start creating flashcards, add your first collection",
    STUDY_FLASHCARDS: "To study all your created flashcards, click",
    HERE: "here",
    EXAMPLE_FLASHCARDS: "Example flashcards",
    EXAMPLE_FLASHCARDS_DESC: "Below, we present a few sample flashcards showcasing the study interface and providing additional information about cardflash."
  },
  GO_BACK: "Back",
  GO_BACK_TO_COLLECTION: "Back to collection",
  WELCOME: "Welcome!",
  ADD: "Add",
  EDIT: "Edit",
  DELETE: "Delete",
  SAVE: "Save",
  CANCEL: "Cancel",
  NAME: "Name",
  SHUFFLE: "Shuffle",
  VIEW_PDF: "View PDF",
  CARDS: "Cards",
  CARDS_FOR: "Flashcards for",
  STUDY_ALL: "Study all",
  VIEW_ALL: "View all",
  NUM_CARDS_SCHEDULED: "{0} cards scheduled",
  OF_NUM_CARDS_DONE: "{numDone} of {numTotal} cards done",
  LANGUAGE: "Language",
  LANGUAGE_SELECTOR: "Language Selector",
  EXPORT_DATA: "Export Data",
  STUDY: {
    SHOW_ANSWER: "Show Answer",
    QUESTION: "Question",
    ANSWER: "Answer",
    NO_CARDS: "No cards due",
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
    IS_EDITING: "Editing card",
    CANCEL_EDITING: "Cancel",
    SAVE: "Save",
  },
  COLLECTION : "Collection",
  COLLECTIONS: {
    DELETE_COLLECTION_WARNING:
      "Are you sure? This will delete all documents and cards in this collection.",
  },
  DOCUMENTS: {
    DELETE_DOCUMENTS_WARNING:
      "Are you sure? This will also delete all cards in this document.",
  },
} satisfies BaseTranslation;

export default en;

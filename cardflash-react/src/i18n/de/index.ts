import type { Translation } from "../i18n-types.js";

const de = {
  ROUTES: {
    HOME: "Start",
    DOCUMENTS: "Dokumente",
    COLLECTIONS: "Sammlungen",
    STUDY: "Lernen",
    SETTINGS: "Einstellungen",
  },
  DOCUMENT: "Dokument",
  COMBINED: "Beides",
  SAMPLE_CARDS: {
    CARD1: {
      front: "<h2>Wie kann ich loslegen und neue Karteikarten erstellen?</h2>",
      back: `<p>Um deine ersten Karteikarten zu erstellen, gehe wie folgt vor:
      <ul>
      <li>Füge zunächst eine <b>neue Sammlung</b> <a href=\"/collections\">hier</a> hinzu</li>
      <li>Wähle die neu erstellte Sammlung aus und <b>füge ein PDF-Dokument</b> zu der Sammlung hinzu.</li>
      <li>Klicke auf das hinzugefügte Dokument. Schon bist du im <b>Editor</b> und kannst manuell oder mit Bildausschnitten der PDF <b>Karteikarten entwerfen</b>.</li>
      </ul></p>`,
    },
    CARD2: {
      front: "<h2>Warum muss ich eine PDF auswählen um Karteikarten zu erstellen?</h2>",
      back: `<p>Bei cardflash sind <b>Karteikarten immer genau mit der Quelle</b> des abgefragten Wissens <b>verknüpft</b>.
      <br/>
      So kannst du beim Lernen super einfach mehr Informationen nachlesen oder Unklarheiten ausräumen.
      <br/>
      <br/>
      Im Moment sind nur PDF-Dateien als Quellenmaterial unterstützt. Du kannst aber auch Websites oder andere Quellen als PDF exportieren und so auch diese in cardflash nutzen.</p>`,
    },
    CARD3: {
      front:
        "<h2>Kann ich die Sprache vom Interface ändern?</h2>",
      back: `<p>Na klar! In den <a href="/settings">Einstellungen</a> kannst du die Sprache ändern.
      <br/>
      Im Moment sind Deutsch und Deutsch als Sprachen verfügbar.</p>`,
    },
  },
  HOME: {
    WELCOME: "Willkommen bei",
    NO_CARDS_STORED:
      "Du hast noch keine gespeicherte Sammlungen, Dokumente oder Karteikarten.",
    ADD_FIRST_COLLECTION:
      "Um neue Karteikarten zu entwerfen, erstelle deine erste Sammlung",
    STUDY_FLASHCARDS: "Um all deine erstellten Karteikarten zu lernen, klicke",
    HERE: "hier",
    EXAMPLE_FLASHCARDS: "Beispiel Karteikarten",
    EXAMPLE_FLASHCARDS_DESC: "Hier unten findest du ein paar Beispiel Karteikarten die das Lerninterface zeigen und zudem zusätztliche Informationen über cardflash vorstellen."
  
  },
  GO_BACK: "Zurück",
  GO_BACK_TO_COLLECTION: "Zurück zur Sammlung",
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
  CARDS_FOR: "Karteikarten für",
  STUDY_ALL: "Alle lernen",
  NUM_CARDS_SCHEDULED: "{0} Karteikarten geplant",
  OF_NUM_CARDS_DONE: "{numDone} von {numTotal} Karteikarten gelernt",
  LANGUAGE: "Sprache",
  LANGUAGE_SELECTOR: "Ausgewählte Sprache",
  STUDY: {
    SHOW_ANSWER: "Antwort anzeigen",
    QUESTION: "Frage",
    ANSWER: "Antwort",
    NO_CARDS: "Keine Karteikarten fällig",
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
    IS_EDITING: "Bearbeite Karteikarte",
    CANCEL_EDITING: "Abbrechen",
    SAVE: "Speichern",
  },
  COLLECTION : "Sammlung",
  COLLECTIONS: {
    DELETE_COLLECTION_WARNING:
      "Bist du sicher? Alle Dokumente und Karteikarten in dieser Sammlung werden gelöscht.",
  },
  DOCUMENTS: {
    DELETE_DOCUMENTS_WARNING:
      "Bist du sicher? Das Dokument und alle Karteikarten von diesem Dokument werden gelöscht.",
  },
} satisfies Translation;

export default de;

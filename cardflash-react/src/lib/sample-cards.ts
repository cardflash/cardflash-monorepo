import { TranslationFunctions } from "@/i18n/i18n-types";
import { Flashcard } from "./storage";

export function getSampleCards(LL: TranslationFunctions): Flashcard[] {
  return [
    {
      id: "test-1",
      type: "simple",
      front: LL.SAMPLE_CARDS.CARD1.front(),
      back: LL.SAMPLE_CARDS.CARD1.back(),
      scheduling: { lastReview: Date.now(), score: 0.66 },
      pdfDocumentID: "",
      pdfPage: undefined,
      lastUpdated: Date.now(),
      created: Date.now(),
    },
    {
      id: "test-2",
      type: "simple",
      front: LL.SAMPLE_CARDS.CARD2.front(),
      back: LL.SAMPLE_CARDS.CARD2.back(),
      scheduling: { lastReview: Date.now(), score: 0.66 },
      pdfDocumentID: "",
      pdfPage: undefined,
      lastUpdated: Date.now(),
      created: Date.now(),
    },
    {
      id: "test-3",
      type: "simple",
      front: LL.SAMPLE_CARDS.CARD3.front(),
      back: LL.SAMPLE_CARDS.CARD3.back(),
      scheduling: { lastReview: Date.now(), score: 0.66 },
      pdfDocumentID: "",
      pdfPage: undefined,
      lastUpdated: Date.now(),
      created: Date.now(),
    },
  ];
}

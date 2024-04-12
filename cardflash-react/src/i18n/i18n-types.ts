// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	ROUTES: {
		/**
		 * H​o​m​e
		 */
		HOME: string
		/**
		 * D​o​c​u​m​e​n​t​s
		 */
		DOCUMENTS: string
		/**
		 * S​t​u​d​y
		 */
		STUDY: string
		/**
		 * S​e​t​t​i​n​g​s
		 */
		SETTINGS: string
	}
	/**
	 * B​a​c​k
	 */
	GO_BACK: string
	/**
	 * W​e​l​c​o​m​e​!
	 */
	WELCOME: string
	/**
	 * A​d​d
	 */
	ADD: string
	/**
	 * C​a​r​d​s
	 */
	CARDS: string
	/**
	 * {​0​}​ ​c​a​r​d​s​ ​s​c​h​e​d​u​l​e​d
	 * @param {unknown} 0
	 */
	NUM_CARDS_SCHEDULED: RequiredParams<'0'>
	/**
	 * {​n​u​m​D​o​n​e​}​ ​o​f​ ​{​n​u​m​T​o​t​a​l​}​ ​c​a​r​d​s​ ​d​o​n​e
	 * @param {unknown} numDone
	 * @param {unknown} numTotal
	 */
	OF_NUM_CARDS_DONE: RequiredParams<'numDone' | 'numTotal'>
	/**
	 * L​a​n​g​u​a​g​e
	 */
	LANGUAGE: string
	/**
	 * L​a​n​g​u​a​g​e​ ​S​e​l​e​c​t​o​r
	 */
	LANGUAGE_SELECTOR: string
	STUDY: {
		/**
		 * S​h​o​w​ ​A​n​s​w​e​r
		 */
		SHOW_ANSWER: string
		/**
		 * Q​u​e​s​t​i​o​n
		 */
		QUESTION: string
		/**
		 * A​n​s​w​e​r
		 */
		ANSWER: string
		/**
		 * N​o​ ​c​a​r​d​s
		 */
		NO_CARDS: string
		ANSWER_OPTIONS: {
			/**
			 * A​g​a​i​n
			 */
			AGAIN: string
			/**
			 * H​a​r​d
			 */
			HARD: string
			/**
			 * G​o​o​d
			 */
			GOOD: string
			/**
			 * E​a​s​y
			 */
			EASY: string
		}
	}
	ERROR_PAGE: {
		/**
		 * U​n​e​x​p​e​c​t​e​d​ ​E​r​r​o​r
		 */
		ERROR: string
		/**
		 * R​e​s​e​t
		 */
		RESET: string
		/**
		 * N​o​t​ ​F​o​u​n​d
		 */
		NOT_FOUND: string
	}
	COMPONENTS: {
		FILE_DROP_ZONE: {
			/**
			 * C​l​i​c​k​ ​t​o​ ​s​e​l​e​c​t​ ​a​ ​f​i​l​e
			 */
			CLICK_TO_SELECT: string
			/**
			 * o​r​ ​d​r​a​g​ ​a​n​d​ ​d​r​o​p
			 */
			OR_DROP: string
		}
	}
	CARD_EDITOR: {
		/**
		 * F​r​o​n​t
		 */
		FRONT: string
		/**
		 * B​a​c​k
		 */
		BACK: string
	}
}

export type TranslationFunctions = {
	ROUTES: {
		/**
		 * Home
		 */
		HOME: () => LocalizedString
		/**
		 * Documents
		 */
		DOCUMENTS: () => LocalizedString
		/**
		 * Study
		 */
		STUDY: () => LocalizedString
		/**
		 * Settings
		 */
		SETTINGS: () => LocalizedString
	}
	/**
	 * Back
	 */
	GO_BACK: () => LocalizedString
	/**
	 * Welcome!
	 */
	WELCOME: () => LocalizedString
	/**
	 * Add
	 */
	ADD: () => LocalizedString
	/**
	 * Cards
	 */
	CARDS: () => LocalizedString
	/**
	 * {0} cards scheduled
	 */
	NUM_CARDS_SCHEDULED: (arg0: unknown) => LocalizedString
	/**
	 * {numDone} of {numTotal} cards done
	 */
	OF_NUM_CARDS_DONE: (arg: { numDone: unknown, numTotal: unknown }) => LocalizedString
	/**
	 * Language
	 */
	LANGUAGE: () => LocalizedString
	/**
	 * Language Selector
	 */
	LANGUAGE_SELECTOR: () => LocalizedString
	STUDY: {
		/**
		 * Show Answer
		 */
		SHOW_ANSWER: () => LocalizedString
		/**
		 * Question
		 */
		QUESTION: () => LocalizedString
		/**
		 * Answer
		 */
		ANSWER: () => LocalizedString
		/**
		 * No cards
		 */
		NO_CARDS: () => LocalizedString
		ANSWER_OPTIONS: {
			/**
			 * Again
			 */
			AGAIN: () => LocalizedString
			/**
			 * Hard
			 */
			HARD: () => LocalizedString
			/**
			 * Good
			 */
			GOOD: () => LocalizedString
			/**
			 * Easy
			 */
			EASY: () => LocalizedString
		}
	}
	ERROR_PAGE: {
		/**
		 * Unexpected Error
		 */
		ERROR: () => LocalizedString
		/**
		 * Reset
		 */
		RESET: () => LocalizedString
		/**
		 * Not Found
		 */
		NOT_FOUND: () => LocalizedString
	}
	COMPONENTS: {
		FILE_DROP_ZONE: {
			/**
			 * Click to select a file
			 */
			CLICK_TO_SELECT: () => LocalizedString
			/**
			 * or drag and drop
			 */
			OR_DROP: () => LocalizedString
		}
	}
	CARD_EDITOR: {
		/**
		 * Front
		 */
		FRONT: () => LocalizedString
		/**
		 * Back
		 */
		BACK: () => LocalizedString
	}
}

export type Formatters = {}

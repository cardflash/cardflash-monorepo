# Cardflash ⚡

Cardflash is an open-source project that allows users to create flashcards directly from PDF learning material such as lecture slides or scripts and to learn from created flashcards.

The key concept of Cardflash is on the __link between the source material and the flashcard content__, which is automatically created when constructing flashcards.
This allows users to go directly to the exact location of the source in the document (the single source of truth) and thus to the answer in the event of questions, ambiguities or the search for further information.

__Note: This repository contains the newest revamped version of Cardflash, written in React__. For the __previous Angular version__, see [github.com/cardflash/cardflash-angular](https://github.com/cardflash/cardflash-angular).



## Screenshots
![Linked Flashcards](https://github.com/cardflash/cardflash-monorepo/assets/20766652/c293788c-b7e5-4c39-a28b-a1e395af0214)


## Features
- Create, save and organize __study material (PDFs)__ in collections
- __Construct flashcards from PDF__ content, __automatically linking__ the information on the cards __back to the exact source__ in the study material
- __Study flashcards__ using spaced repetition
- Beautiful and intuitive user interface (on Desktop and Mobile)



## Contribution & Tech Stack
Cardflash is built on top of the great shoulders of web standards and web technology.
As apparent by the tech stack choices (see below), we embrace full type safety, whenever possible.

This monorepo currently only contains the web frontend code (a React SPA), located in the `cardflash-react` directory.


### Frontend
The main user interface is implemented in React with Typescript and TailwindCSS.

Internationalization (i.e. a translation system) is done using [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n).

Data is stored locally in the IndexedDB of the browser, using [idb](https://github.com/jakearchibald/idb) as a wrapper.

Routing is implemented using [TanStack Router](https://github.com/TanStack/router), where search parameter validation is done using [zod](https://github.com/colinhacks/zod).


To start developing the project, clone this repository and run the following commands in the `cardflash-react` folder:
- `npm install`
- `npm run dev`

If you also plan on changing translations, you will also need to run `npm run typesafe-i18n` in a second terminal.

# Cardflash ⚡

Cardflash is an open-source project that allows users to create flashcards directly from PDF learning material such as lecture slides or scripts and to learn from created flashcards.

The key concept of Cardflash is on the __link between the source material and the flashcard content__, which is automatically created when constructing flashcards.
This allows users to go directly to the exact location of the source in the document (the single source of truth) and thus to the answer in the event of questions, ambiguities or the search for further information.

__Note: This repository contains the newest revamped version of Cardflash, written in React__. For the __previous Angular version__, see [github.com/cardflash/cardflash-angular](https://github.com/cardflash/cardflash-angular).


A free hosted version of Cardflash is available at __[app.cardflash.net](https://app.cardflash.net)__.
Just head there to give Carflash a try live!

Apart from that, Cardflash can, of course, also easily be self-hosted (currently as a static frontend SPA). 

## Screenshots
![Linked Flashcards](https://github.com/cardflash/cardflash-monorepo/assets/20766652/c293788c-b7e5-4c39-a28b-a1e395af0214)


## Features
- Create, save and organize __study material (PDFs)__ in collections
- __Construct flashcards from PDF__ content, __automatically linking__ the information on the cards __back to the exact source__ in the study material
- __Study flashcards__ using spaced repetition
- Beautiful and intuitive user interface (on Desktop and Mobile)

## Tutorial
### Creating a Collection
1. Navigate to the collections page using the menu button on the right (or on the bottom on mobile)
![Screenshot showing the Collections Page Navigation Button](https://github.com/cardflash/cardflash-monorepo/assets/20766652/379651b6-6103-4b63-b3f5-a2235555f039)
2. Click on the `Add...` button and enter the name of the new collection (e.g., the name of your lecture)

### Adding Documents (Source Material) to a Collection
1. Navigate to the collections page and click on the collection you want to add your material to
2. Select the PDF file you want to add from your device
![Screenshot of a collections page with a dropzone for PDF files](https://github.com/cardflash/cardflash-monorepo/assets/20766652/a8e053e1-e91c-462c-99a3-ddcca24c459a)

### Creating Flashcards
1. Navigate to the document you wish to create cards for
2. Select content from the PDF Viewer to add them to a flashcard
   - For text, simply select the text in the PDF viewer. After a small delay, options to add this text will appear to the right of the selection.
        - ![Screenshot of an active text selection](https://github.com/cardflash/cardflash-monorepo/assets/20766652/f8669517-3a74-4365-a169-ab59b7dd9a87)
   - For an image area, first toggle area selection mode using the button on the bottom. The PDF viewer will become darker, and you can click and drag anywhere on the PDF viewer to select an area.
       - ![Screenshot of an active area selection](https://github.com/cardflash/cardflash-monorepo/assets/20766652/d50ed317-a858-4f27-8557-1f2c7fbc7e44)
3. When a selection is active, you can toggle between adding it to the front or back of the flashcard using the button in the middle. The top button with a `+` will add the selection to the current flashcard.
4. You can edit the flashcard manually in the `Cards` or `Combined` view (selectable on the top). 

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

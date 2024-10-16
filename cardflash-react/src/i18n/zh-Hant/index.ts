import type { BaseTranslation } from "../i18n-types.js";

const zh_hant = {
  ROUTES: {
    HOME: "首頁",
    DOCUMENTS: "文件",
    COLLECTIONS: "集錦",
    STUDY: "學習",
    SETTINGS: "設定",
  },
  DOCUMENT: "文件",
  COMBINED: "混合",
  SAMPLE_CARDS: {
    CARD1: {
      front: "<h2>如何開始並製作新的學習卡片？</h2>",
      back: `<p>要製作您的第一批學習卡片，請按照以下步驟操作：
      <ul>
        <li>首先， <a href=\"/collections\">在這裡</a>新增一個<b>新的集錦</b></li>
        <li>選擇新建立的集錦，然後<b>新增一個 PDF 文件</b>到該集錦中。</li>
        <li>點擊已新增的文件。現在您已進入<b>編輯器</b>，可以手動或從 PDF 中擷取圖片來<b>設計學習卡片</b>。</li>
      </ul>
    </p>
    `,
    },
    CARD2: {
      front: "<h2>為什麼我需要選擇 PDF 來製作學習卡片？</h2>",
      back: `<p>在 cardflash 中，<b>你可以直接連結到學習卡片的資訊來源</b>。
      <br/>
      如此一來，在學習時，你可以輕易地取得更多資訊或澄清任何疑問。
      <br/>
      <br/>
      目前，僅支援 PDF 檔案格式作為資料來源。不過，你也可以將網站或其他來源匯出為 PDF，並以此方式在 cardflash 中使用。</p>
`,
    },
    CARD3: {
      front: "<h2>我可以更改介面的語言嗎？</h2>",
      back: `<p>當然！請前往<a href="/settings">設定</a>來更改語言。
      <br/>
      目前可使用的語言有英文、德文和繁體中文。</p>`,
    },
  },
  HOME: {
    WELCOME: "歡迎來到",
    NO_CARDS_STORED: "目前您尚未儲存任何集錦、文件或學習卡片。",
    ADD_FIRST_COLLECTION: "要開始製作學習卡片，請新增您的第一個集錦",
    STUDY_FLASHCARDS: "若要學習您所有已建立的學習卡片，請點擊",
    HERE: "這裏",
    EXAMPLE_FLASHCARDS: "範例學習卡片",
    EXAMPLE_FLASHCARDS_DESC:
      "在下方，我們展示幾個範例學習卡片，向你展示學習介面並提供有關 cardflash 的額外資訊。",
  },
  GO_BACK: "返回",
  GO_BACK_TO_COLLECTION: "回到集錦總覽",
  WELCOME: "歡迎！",
  ADD: "新增",
  EDIT: "編輯",
  DELETE: "移除",
  SAVE: "儲存",
  CANCEL: "取消",
  NAME: "名稱",
  SHUFFLE: "洗牌",
  VIEW_PDF: "檢視 PDF",
  CARDS: "卡片",
  CARDS_FOR: "學習卡片：",
  STUDY_ALL: "學習全部",
  VIEW_ALL: "檢視全部",
  NUM_CARDS_SCHEDULED: "{0} 張卡片已排程",
  OF_NUM_CARDS_DONE: "{numDone} 張卡片完成，共 {numTotal} 張",
  LANGUAGE: "語言",
  LANGUAGE_SELECTOR: "語言選擇",
  EXPORT_DATA: "匯出資料",
  STUDY: {
    SHOW_ANSWER: "顯示答案",
    QUESTION: "問題",
    ANSWER: "答案",
    NO_CARDS: "沒有卡片需要學習",
    ANSWER_OPTIONS: {
      AGAIN: "再次學習",
      HARD: "困難",
      GOOD: "普通",
      EASY: "簡單",
    },
  },
  ERROR_PAGE: {
    ERROR: "無法預期的錯誤",
    RESET: "重設",
    NOT_FOUND: "找不到",
  },
  COMPONENTS: {
    FILE_DROP_ZONE: {
      CLICK_TO_SELECT: "點擊來選擇文件",
      OR_DROP: "或是拖曳",
    },
  },
  CARD_EDITOR: {
    FRONT: "正面",
    BACK: "背面",
    IS_EDITING: "卡片編輯中",
    CANCEL_EDITING: "取消編輯",
    SAVE: "儲存",
  },
  COLLECTION: "集錦",
  COLLECTIONS: {
    DELETE_COLLECTION_WARNING:
      "您確定嗎？此動作將會刪除此集錦中的所有文件和卡片。",
  },
  DOCUMENTS: {
    DELETE_DOCUMENTS_WARNING: "您確定嗎？此動作也會刪除此文件中的所有卡片。",
  },
} satisfies BaseTranslation;

export default zh_hant;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import type { PDFRenderingQueue, PDFThumbnailViewer } from "pdfjs-dist/types/web/pdf_thumbnail_viewer";
import type {
  DownloadManager,
  EventBus,
  GenericL10n,
  PDFFindController,
  PDFLinkService,
  PDFPageView,
  PDFScriptingManager,
  PDFViewer,
  ProgressBar,
} from "pdfjs-dist/types/web/pdf_viewer.component";

export interface AnnotatedSVGPage {
  svg: string;
  bounds: { x1: number; x2: number; y1: number; y2: number };
  pageWidth: number;
  pageHeight: number;
}

export interface PDFExcalidrawSinglePageProps {
  onCloseWithoutSave?: () => any;
  onSave?: (data: AnnotatedSVGPage) => any;
  pageDataURL: string;
  imgWidth: number;
  imgHeight: number;
  previousData?: AnnotatedSVGPage;
  darkMode?: boolean;
}

export interface PDFViewerApplication {
  initialBookmark: string;
  appConfig: Object;
  pdfDocument: PDFDocumentProxy;
  pdfLoadingTask: PDFDocumentLoadingTask;
  printService: any; // null?
  pdfViewer: PDFViewer;
  pdfThumbnailViewer: PDFThumbnailViewer;
  pdfRenderingQueue: PDFRenderingQueue;
  pdfPresentationMode: any; //PDFPresentationMode;
  pdfDocumentProperties: any; //PDFDocumentProperties;
  pdfLinkService: PDFLinkService;
  pdfHistory: any; // null?
  pdfSidebar: any; //PDFSidebar;
  pdfSidebarResizer: any; //PDFSidebarResizer;
  pdfOutlineViewer: any; //PDFOutlineViewer;
  pdfAttachmentViewer: any; //PDFAttachmentViewer;
  pdfLayerViewer: any; //PDFLayerViewer;
  pdfCursorTools: any; //PDFCursorTools;
  pdfScriptingManager: PDFScriptingManager;
  store: any; //ViewHistory;
  downloadManager: DownloadManager;
  overlayManager: any; //OverlayManager;
  preferences: any; //GenericPreferences;
  toolbar: any; //Toolbar;
  secondaryToolbar: any; //SecondaryToolbar;
  eventBus: EventBus;
  l10n: GenericL10n;
  annotationEditorParams: any; //AnnotationEditorParams;
  isInitialViewSet: boolean;
  downloadComplete: boolean;
  isViewerEmbedded: boolean;
  url: string;
  baseUrl: string;
  externalServices: () => any; // class GenericExternalServices extends _app.DefaultExternalServices {
  documentInfo: Object;
  metadata: any; // null?
  initialize: (a0: any) => any; // async initialize(appConfig) {
  run: (a0: any) => any; // run(config) {
  initialized: boolean;
  initializedPromise: Promise<any>;
  zoomIn: (a0: any, a1: any) => any; // zoomIn(steps, scaleFactor) {
  zoomOut: (a0: any, a1: any) => any; // zoomOut(steps, scaleFactor) {
  zoomReset: () => any; // zoomReset() {
  pagesCount: number;
  page: number;
  supportsPrinting: boolean;
  supportsFullscreen: boolean;
  supportsPinchToZoom: boolean;
  supportsIntegratedFind: boolean;
  supportsDocumentFonts: boolean;
  loadingBar: ProgressBar;
  supportedMouseWheelZoomModifierKeys: Object;
  initPassiveLoading: () => any; // initPassiveLoading() {
  setTitleUsingUrl: (url?: string, downloadUrl?: string | null) => any; // setTitleUsingUrl(url = \"\", downloadUrl = null) {
  setTitle: (title?: string) => any; // setTitle(title = this._title) {
  close: () => any; // async close() {
  open: (args: any) => any; // async open(args) {
  download: () => any; // async download() {
  save: () => any; // async save() {
  downloadOrSave: () => any; // downloadOrSave() {
  progress: (level: any) => any; // progress(level) {
  load: (pdfDocument: any) => any; // load(pdfDocument) {
  setInitialView: (storedHash: any) => any; // setInitialView(storedHash, {
  forceRendering: () => any; // forceRendering() {
  beforePrint: () => any; // beforePrint() {
  afterPrint: () => any; // afterPrint() {
  rotatePages: (delta: any) => any; // rotatePages(delta) {
  requestPresentationMode: () => any; // requestPresentationMode() {
  triggerPrinting: () => any; // triggerPrinting() {
  bindEvents: () => any; // bindEvents() {
  bindWindowEvents: () => any; // bindWindowEvents() {
  unbindEvents: () => any; // unbindEvents() {
  unbindWindowEvents: () => any; // unbindWindowEvents() {
  scriptingReady: boolean;
  findController: PDFFindController;
  findBar: any; // PDFFindBar;
  passwordPrompt: any; //PasswordPrompt;
}

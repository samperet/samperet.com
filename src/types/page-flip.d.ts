// page-flip ships no typings; this covers the part of its API the book reader uses.
declare module 'page-flip' {
  export type Orientation = 'portrait' | 'landscape';
  export interface FlipSetting {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    usePortrait?: boolean;
    autoSize?: boolean;
    mobileScrollSupport?: boolean;
    flippingTime?: number;
    maxShadowOpacity?: number;
    drawShadow?: boolean;
    startPage?: number;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }
  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSetting);
    loadFromHTML(pages: NodeListOf<Element> | Element[]): void;
    loadFromImages(urls: string[]): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(page: number, corner?: 'top' | 'bottom'): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): Orientation;
    update(): void;
    destroy(): void;
    on(event: 'flip' | 'changeOrientation' | 'changeState' | 'init' | 'update', callback: (e: { data: any; object: PageFlip }) => void): this;
  }
}

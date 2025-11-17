export interface Reel {
  id: number;
  title: string;
  content: string;
  audioSrc?: string;
  bgImage?: string;
  // For Next Image LCP use — provide true image size if known.
  // If missing, defaults will be used in ReelMedia.
  bgImageWidth?: number;
  bgImageHeight?: number;
  bgVideo?: string;
}

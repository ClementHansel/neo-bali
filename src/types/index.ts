export type Project = {
  slug: string;
  title: string;
  year?: string;
  excerpt?: string;
  images: string[]; // paths under /public/images/...
  services?: string[];
  externalUrl?: string;
};

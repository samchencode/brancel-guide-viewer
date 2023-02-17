export type GetImageUrisFromHtml = (html: string) => string[];
export type ReplaceImageUrisInHtmlBody = (
  html: string,
  uriMap: Record<string, string>
) => string;

export type SanitizeHtml = (html: string) => string;
export type GetImageUrisFromHtml = (html: string) => string[];
export type ReplaceImageUrisInHtmlBody = (
  html: string,
  uriMap: Record<string, string>
) => string;
export type ReplaceImageUrisWithBase64InHtmlBody = (
  html: string
) => Promise<string>;

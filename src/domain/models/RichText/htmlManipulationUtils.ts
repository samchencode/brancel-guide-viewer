export type SanitizeHtml = (html: string) => string;
export type GetImageUrisFromHtml = (html: string) => string[];
export type ReplaceImageUrisInHtmlBody = (
  html: string,
  uriMap: Record<string, string>
) => string;
export type ReplaceImageUrisInHtml = (
  html: string,
  uriMap: Record<string, string>
) => string;
export type ReplaceImageUrisWithBase64InHtml = (
  html: string
) => Promise<string>;

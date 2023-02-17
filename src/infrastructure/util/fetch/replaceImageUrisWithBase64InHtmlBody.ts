import type {
  GetImageUrisFromHtml,
  ReplaceImageUrisInHtmlBody,
  ReplaceImageUrisWithBase64InHtmlBody,
} from '@/infrastructure/util/types';

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function toDataUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blobToDataUrl(blob);
}

function factory(
  getImageUrisFromHtml: GetImageUrisFromHtml,
  replaceImageUrisInHtmlBody: ReplaceImageUrisInHtmlBody
): ReplaceImageUrisWithBase64InHtmlBody {
  return async function replaceImageUrisWithBase64InHtmlBody(html) {
    const imageUris = getImageUrisFromHtml(html);
    const promises = imageUris.map((uri) =>
      toDataUrl(uri).then((b64) => [uri, b64] as const)
    );
    const uriMap = Object.fromEntries(await Promise.all(promises));
    return replaceImageUrisInHtmlBody(html, uriMap);
  };
}

export { factory };

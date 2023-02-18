import type {
  GetImageUrisFromHtml,
  ReplaceImageUrisInHtml,
  ReplaceImageUrisWithBase64InHtml,
} from '@/domain/models/RichText/htmlManipulationUtils';

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
  replaceImageUrisInHtml: ReplaceImageUrisInHtml
): ReplaceImageUrisWithBase64InHtml {
  return async function replaceImageUrisWithBase64InHtml(html) {
    const imageUris = getImageUrisFromHtml(html);
    const promises = imageUris.map((uri) =>
      toDataUrl(uri).then((b64) => [uri, b64] as const)
    );
    const uriMap = Object.fromEntries(await Promise.all(promises));
    return replaceImageUrisInHtml(html, uriMap);
  };
}

export { factory };

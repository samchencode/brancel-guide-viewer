import type {
  GetImageUrisFromHtml,
  ReplaceImageUrisInHtml,
  ReplaceImageUrisWithBase64InHtml,
} from '@/domain/models/RichText/htmlManipulationUtils';
import { ENCODING_TYPES } from '@/infrastructure/file-system/constants';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';

// Public Domain Image from:
// https://en.wikipedia.org/wiki/Bone_fracture#/media/File:Broken_fixed_arm.jpg
// eslint-disable-next-line @typescript-eslint/no-var-requires
const image = require('@/infrastructure/html-manipulation/fake/replaceImageUrisWithBase64InHtml/Broken_fixed_arm.jpg');

function factory(
  getImageUrisFromHtml: GetImageUrisFromHtml,
  replaceImageUrisInHtml: ReplaceImageUrisInHtml,
  fileSystem: FileSystem
): ReplaceImageUrisWithBase64InHtml {
  return async function replaceImageUrisWithBase64InHtml(html) {
    const imageUris = getImageUrisFromHtml(html);
    const assetB64 = await fileSystem.getAssetAsString(
      image,
      ENCODING_TYPES.BASE_64
    );
    const imageB64 = `data:image/png;base64,${assetB64}`;
    const uriMap = imageUris.length > 0 ? { [imageUris[0]]: imageB64 } : {};
    return replaceImageUrisInHtml(html, uriMap);
  };
}

export { factory };

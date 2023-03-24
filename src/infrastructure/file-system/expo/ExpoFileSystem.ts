import * as ExpoFileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { v4 as uuidv4 } from 'uuid';
import type {
  EncodingType,
  FileSystem,
} from '@/infrastructure/file-system/FileSystem';

class ExpoAssetFileSystem implements FileSystem<'expo'> {
  async getAssetAsString(
    virtualAssetModule: number,
    encodingType: EncodingType = 'utf8'
  ) {
    const asset = await Asset.fromModule(virtualAssetModule).downloadAsync();
    return ExpoFileSystem.readAsStringAsync(asset.localUri as string, {
      encoding: encodingType,
    });
  }

  async cacheFile(uri: string) {
    const ext = uri.match(/\.[a-zA-Z]+$/)?.[0] ?? '';
    const destination = `${
      ExpoFileSystem.cacheDirectory
    }/images-v1/${uuidv4()}${ext}`;
    const result = await ExpoFileSystem.downloadAsync(uri, destination);
    return result.uri;
  }

  async readFileAsString(
    path: string,
    encodingType?: EncodingType
  ): Promise<string> {
    return ExpoFileSystem.readAsStringAsync(path, {
      encoding: encodingType,
    });
  }

  async checkFileExists(path: string): Promise<boolean> {
    const info = await ExpoFileSystem.getInfoAsync(path);
    return info.exists;
  }
}

export { ExpoAssetFileSystem };

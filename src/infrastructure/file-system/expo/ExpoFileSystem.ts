import * as ExpoFileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type {
  EncodingType,
  FileSystem,
} from '@/infrastructure/file-system/FileSystem';

class ExpoAssetFileSystem implements FileSystem<'expo'> {
  private imageCacheDirectory = `${ExpoFileSystem.cacheDirectory}/images-v1`;

  private cacheDirectoryReady: Promise<void>;

  constructor() {
    this.cacheDirectoryReady = this.makeCacheDirectoryIfNotExists();
  }

  private async makeCacheDirectoryIfNotExists() {
    const info = await ExpoFileSystem.getInfoAsync(this.imageCacheDirectory);
    if (!info.exists)
      await ExpoFileSystem.makeDirectoryAsync(this.imageCacheDirectory);
  }

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
    await this.cacheDirectoryReady;
    const ext = uri.match(/\.[a-zA-Z]+$/)?.[0] ?? '';
    const destination = `${this.imageCacheDirectory}/${uuidv4()}${ext}`;
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

  async deleteFile(uri: string): Promise<void> {
    return ExpoFileSystem.deleteAsync(uri, {
      idempotent: true,
    });
  }

  async clearCache(): Promise<void> {
    await ExpoFileSystem.deleteAsync(this.imageCacheDirectory, {
      idempotent: true,
    });
    this.cacheDirectoryReady = this.makeCacheDirectoryIfNotExists();
    await this.cacheDirectoryReady;
  }
}

export { ExpoAssetFileSystem };

import type { ENCODING_TYPES } from '@/infrastructure/file-system/constants';

type RequireAssetModuleOnPlatform = {
  jest: string;
  expo: number;
};

type ValueOf<T> = T extends { [K in string | number | symbol]: infer R }
  ? R
  : never;

type EncodingType = ValueOf<typeof ENCODING_TYPES>;

type VirtualAssetModule<T> = T extends keyof RequireAssetModuleOnPlatform
  ? RequireAssetModuleOnPlatform[T]
  : ValueOf<RequireAssetModuleOnPlatform>;

interface FileSystem<T = unknown> {
  getAssetAsString(
    virtualAssetModule: VirtualAssetModule<T>,
    encodingType?: EncodingType
  ): Promise<string>;
  cacheFile(uri: string): Promise<string>;
  readFileAsString(path: string, encodingType?: EncodingType): Promise<string>;
  checkFileExists(path: string): Promise<boolean>;
  deleteFile(uri: string): Promise<void>;
}

export type { FileSystem, EncodingType };

import fs from 'fs';
import path from 'path';
import type {
  EncodingType,
  FileSystem,
} from '@/infrastructure/file-system/FileSystem';
import { ENCODING_TYPES } from '@/infrastructure/file-system/constants';

const NODE_ENCODING_TYPES = {
  [ENCODING_TYPES.UTF_8]: 'utf-8',
  [ENCODING_TYPES.BASE_64]: 'base64',
} as const;

type ValueOf<T> = T[keyof T];

type NodeEncodingTypes = ValueOf<typeof NODE_ENCODING_TYPES>;

const readUtf8File = (p: string, encoding: NodeEncodingTypes) =>
  new Promise<string>((resolve, reject) => {
    fs.readFile(p, encoding, (err, data) =>
      err ? reject(err) : resolve(data)
    );
  });

class NodeFileSystem implements FileSystem<'jest'> {
  async getAssetAsString(
    aliasedFilePath: string,
    encodingType: EncodingType = 'utf8'
  ): Promise<string> {
    const filePath = aliasedFilePath.replace(
      /^@/,
      path.resolve(__dirname, '../../..')
    );
    return readUtf8File(filePath, NODE_ENCODING_TYPES[encodingType]);
  }

  cacheFile(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  readFileAsString(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  checkFileExists(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  deleteFile(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export { NodeFileSystem };

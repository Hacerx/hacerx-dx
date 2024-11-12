import { writeFile as fsWriteFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';
import * as prettier from 'prettier';

export async function writeFile(...params: Parameters<typeof fsWriteFile>): Promise<void> {
  const path = params[0] as string;
  const dir = dirname(path);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  return fsWriteFile(...params);
}

export function format(content: string): string {
  return prettier.format(content, { parser: 'typescript' });
}

import { get, put } from '@vercel/blob';
import { readFile, writeFile, mkdir, chmod } from 'node:fs/promises';
import path from 'node:path';

const pathname = 'asouga-content.json';
const localFile = path.join(process.cwd(), 'data', pathname);

export async function readSavedContent(): Promise<Record<string, unknown> | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const saved = await get(pathname, { access: 'private', useCache: false });
    if (!saved?.stream) return null;
    const raw = await new Response(saved.stream).text();
    return JSON.parse(raw) as Record<string, unknown>;
  }

  try {
    return JSON.parse(await readFile(localFile, 'utf8')) as Record<string, unknown>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

export async function writeSavedContent(content: Record<string, unknown>): Promise<void> {
  const serialized = JSON.stringify(content, null, 2);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(pathname, serialized, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await mkdir(path.dirname(localFile), { recursive: true, mode: 0o700 });
  await writeFile(localFile, serialized, { mode: 0o600 });
  await chmod(localFile, 0o600);
}

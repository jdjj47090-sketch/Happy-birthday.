import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { sections, stars, questions, officialLetter, identity, theme, settings } from '@/data/content';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  let content = { sections, stars, questions, officialLetter, identity, theme, settings };
  try { content = { ...content, ...JSON.parse(await readFile(path.join(process.cwd(), 'data', 'asouga-content.json'), 'utf8')) }; } catch {}
  return NextResponse.json(content, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

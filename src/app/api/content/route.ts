import { NextResponse } from 'next/server';
import { readSavedContent } from '@/lib/content-store';
import { sections, stars, questions, officialLetter, identity, theme, settings } from '@/data/content';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  let content = { sections, stars, questions, officialLetter, identity, theme, settings };
  const saved = await readSavedContent();
  if (saved) content = { ...content, ...saved };
  return NextResponse.json(content, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readFile, writeFile, mkdir, chmod } from 'node:fs/promises';
import path from 'node:path';
import { sections, stars, questions, officialLetter, identity, theme, settings } from '@/data/content';
export const runtime = 'nodejs';
const file = path.join(process.cwd(), 'data', 'asouga-content.json');
const defaults = { sections, stars, questions, officialLetter, identity, theme, settings };
async function current() {
  try { return { ...defaults, ...JSON.parse(await readFile(file, 'utf8')) }; }
  catch { return defaults; }
}
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  return NextResponse.json(await current());
}
export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  let data: any;
  try { data = await request.json(); } catch { return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 }); }
  if (!data || typeof data !== 'object' || !data.identity || !['name','nickname','callName','sender'].every(k => typeof data.identity[k] === 'string' && data.identity[k].length > 0 && data.identity[k].length <= 60) || !data.theme || !['black','plum','burgundy','rose','gold','white'].every(k => typeof data.theme[k] === 'string' && /^#[0-9a-f]{6}$/i.test(data.theme[k])) || !data.settings || typeof data.settings.animations !== 'boolean' || typeof data.settings.canvas !== 'boolean' || !data.settings.enabledSections || !['portal','museum','games','galaxy','treasure','letter','finale'].every(k => typeof data.settings.enabledSections[k] === 'boolean') || typeof data.officialLetter !== 'string' || data.officialLetter.length > 30_000 || !Array.isArray(data.sections) || data.sections.length !== 5 || data.sections.some((x: any) => !x || typeof x.title !== 'string' || typeof x.text !== 'string' || x.title.length > 100 || x.text.length > 3000) || !Array.isArray(data.stars) || data.stars.length !== 6 || data.stars.some((x: unknown) => typeof x !== 'string' || x.length > 300) || !Array.isArray(data.questions) || data.questions.length < 1 || data.questions.length > 20 || data.questions.some((x: any) => !x || typeof x.q !== 'string' || !Array.isArray(x.a) || !Array.isArray(x.replies) || x.a.length < 2 || x.a.length > 6 || x.a.length !== x.replies.length || x.q.length > 300 || [...x.a, ...x.replies].some((v: unknown) => typeof v !== 'string' || v.length > 300))) return NextResponse.json({ error: 'تحققي من النصوص والأسئلة' }, { status: 400 });
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await writeFile(file, JSON.stringify({ sections: data.sections, stars: data.stars, questions: data.questions, officialLetter: data.officialLetter, identity: data.identity, theme: data.theme, settings: data.settings }, null, 2), { mode: 0o600 });
  await chmod(file, 0o600);
  return NextResponse.json({ ok: true });
}

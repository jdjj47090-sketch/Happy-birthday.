import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSession } from '@/lib/admin-auth';
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.until > now && record.count >= 5) return NextResponse.json({ error: '잠시 후 다시 시도해 주세요.' }, { status: 429 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 }); }
  const password = typeof body === 'object' && body && 'password' in body ? (body as { password: unknown }).password : null;
  if (typeof password !== 'string' || password.length > 200 || !(await checkPassword(password))) {
    attempts.set(ip, { count: (record?.until && record.until > now ? record.count : 0) + 1, until: now + 15 * 60_000 });
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }
  attempts.delete(ip);
  await createSession();
  return NextResponse.json({ ok: true });
}

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';

const scrypt = promisify(scryptCallback);
const COOKIE = 'asouga_admin';
const ttl = 60 * 60 * 8;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters');
  return value;
}
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }
export async function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD_HASH;
  const salt = process.env.ADMIN_PASSWORD_SALT;
  if (!expected || !/^[a-f0-9]{128}$/i.test(expected) || !salt || salt.length < 16 || password.length > 200) return false;
  const actual = await scrypt(password, salt, 64) as Buffer;
  const hash = Buffer.from(expected, 'hex');
  return timingSafeEqual(actual, hash);
}
export async function createSession() {
  const exp = String(Math.floor(Date.now() / 1000) + ttl);
  const nonce = randomBytes(12).toString('hex');
  const body = `${exp}.${nonce}`;
  (await cookies()).set(COOKIE, `${body}.${sign(body)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: ttl });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [exp, nonce, mac, extra] = token.split('.');
  if (!exp || !nonce || !mac || extra || Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(`${exp}.${nonce}`), 'hex');
  const actual = Buffer.from(mac, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

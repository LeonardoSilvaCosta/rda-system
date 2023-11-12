import crypto from 'crypto';
export function generateRandomPassword(length: number) {
  const password = crypto.randomBytes(length).toString('base64');
  return password;
}

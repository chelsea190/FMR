type OtpRecord = { code: string; expiresAt: number; verified?: boolean };
const store = new Map<string, OtpRecord>();

export function generateOtp(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  store.set(email.toLowerCase(), { code, expiresAt: Date.now() + 10 * 60 * 1000 });
  return code;
}

export function verifyOtp(email: string, otp: string) {
  const key = email.toLowerCase();
  const record = store.get(key);
  if (!record || record.expiresAt < Date.now() || record.code !== otp) return false;
  record.verified = true;
  store.set(key, record);
  return true;
}

export function hasVerifiedOtp(email: string) {
  const record = store.get(email.toLowerCase());
  return Boolean(record?.verified && record.expiresAt >= Date.now());
}

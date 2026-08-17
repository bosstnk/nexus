export const EMAIL_TAKEN = "อีเมลนี้ถูกใช้งานแล้ว";

export const ERROR_TH: Record<string, string> = {
  email_address_invalid: "รูปแบบอีเมลไม่ถูกต้อง",
  weak_password: "รหัสผ่านไม่ปลอดภัยพอ กรุณาตั้งรหัสผ่านที่คาดเดายากขึ้น",

  email_exists: EMAIL_TAKEN,
  user_already_exists: "มีบัญชีผู้ใช้นี้อยู่แล้ว",
  email_provider_disabled: "ขณะนี้ระบบปิดรับสมัครด้วยอีเมลชั่วคราว",
  signup_disabled: "ขณะนี้ระบบปิดรับสมัครสมาชิกชั่วคราว",
  over_email_send_rate_limit: "ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่",
  over_request_rate_limit: "มีคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่",
};

export function toThai(
  error: { code?: string; message: string },
  fallback: string,
): string {
  if (error.code === "over_email_send_rate_limit") {
    if (error.message.includes("rate limit exceeded")) {
      return "ระบบส่งอีเมลถึงขีดจำกัดแล้ว กรุณาลองใหม่ภายหลัง";
    }
    return "ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  }
  return (error.code && ERROR_TH[error.code]) || fallback;
}

export const confirmRedirectTo = () =>
  `${window.location.origin}/signup-success`;

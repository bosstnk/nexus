export const EMAIL_TAKEN = "อีเมลนี้ถูกใช้งานแล้ว";
export const LOGIN_FAILED = "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน";

export const ERROR_TH: Record<string, string> = {
  email_address_invalid: "รูปแบบอีเมลไม่ถูกต้อง",
  weak_password: "รหัสผ่านไม่ปลอดภัยพอ กรุณาตั้งรหัสผ่านที่คาดเดายากขึ้น",
  validation_failed: "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน",

  email_exists: EMAIL_TAKEN,
  user_already_exists: "มีบัญชีผู้ใช้นี้อยู่แล้ว",
  email_provider_disabled: "ขณะนี้ระบบปิดรับสมัครด้วยอีเมลชั่วคราว",
  signup_disabled: "ขณะนี้ระบบปิดรับสมัครสมาชิกชั่วคราว",
  over_email_send_rate_limit: "ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่",
  over_request_rate_limit: "มีคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่",

  invalid_credentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  email_not_confirmed:
    "บัญชีนี้ยังไม่ได้ยืนยันอีเมล กรุณากดลิงก์ยืนยันในกล่องจดหมายของคุณ",
  user_banned: "บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
  provider_disabled: "ขณะนี้ระบบปิดการเข้าสู่ระบบด้วยอีเมลชั่วคราว",
};

export function toThai(
  error: { code?: string; message: string; status?: number },
  fallback: string,
): string {
  if (error.code === "over_email_send_rate_limit") {
    if (error.message.includes("rate limit exceeded")) {
      return "ระบบส่งอีเมลถึงขีดจำกัดแล้ว กรุณาลองใหม่ภายหลัง";
    }
    return "ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  }

  // AuthRetryableFetchError carries no code. Without this branch every network
  // blip reads as "ตรวจสอบอีเมลหรือรหัสผ่าน" and sends users chasing the
  // wrong problem.
  if (
    !error.code &&
    (error.status === 0 || /fetch|network/i.test(error.message))
  ) {
    return "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่";
  }

  return (error.code && ERROR_TH[error.code]) || fallback;
}

// Browser-only: reads window.location. Call from an event handler, never at
// module scope.
export const confirmRedirectTo = (next = "/signup-success") =>
  `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

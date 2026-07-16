/**
 * Standard API result envelope — Thai user-facing messages only.
 */

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; messageTh: string };

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

export function fail(code: string, messageTh: string): ApiResult<never> {
  return { ok: false, code, messageTh };
}

export function unauthorized(messageTh = "คุณไม่มีสิทธิ์เข้าใช้งานส่วนนี้"): ApiResult<never> {
  return fail("UNAUTHORIZED", messageTh);
}

export function forbidden(messageTh = "บทบาทของคุณไม่สามารถทำรายการนี้ได้"): ApiResult<never> {
  return fail("FORBIDDEN", messageTh);
}

export function validationError(messageTh: string): ApiResult<never> {
  return fail("VALIDATION_ERROR", messageTh);
}

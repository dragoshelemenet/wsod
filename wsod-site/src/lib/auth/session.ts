import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "wsod_admin_session";

function shouldUseSecureCookies() {
  const raw = process.env.SECURE_COOKIES?.trim().toLowerCase();

  if (raw === "true") return true;
  if (raw === "false") return false;

  return process.env.NODE_ENV === "production";
}

export async function setAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "true", {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value === "true";
}
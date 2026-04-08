"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSession } from "@/lib/auth/session";

export async function loginAction(
  _prevState: { success: boolean; message: string },
  formData: FormData
) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username !== validUsername || password !== validPassword) {
    return {
      success: false,
      message: "Date incorecte.",
    };
  }

  await setAdminSession();
  redirect("/studio-dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/studio-login");
}
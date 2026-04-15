"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth-actions";

const initialState = {
  success: false,
  message: "",
};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form className="admin-form" action={formAction}>
      <div className="admin-form-field">
        <label htmlFor="username">Utilizator</label>
        <input id="username" name="username" type="text" placeholder="admin" />
      </div>

      <div className="admin-form-field">
        <label htmlFor="password">Parolă</label>
        <input id="password" name="password" type="password" placeholder="••••••••" />
      </div>

      {state?.message ? <p className="admin-error">{state.message}</p> : null}

      <button type="submit" className="admin-submit" disabled={isPending}>
        {isPending ? "Se verifică..." : "Intră în panou"}
      </button>
    </form>
  );
}
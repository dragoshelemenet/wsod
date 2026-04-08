"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTE, validateMockLogin } from "@/lib/auth/mock-auth";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = validateMockLogin(username, password);

    if (!isValid) {
      setErrorText("Date incorecte. Încearcă din nou.");
      return;
    }

    localStorage.setItem("wsod_admin_logged_in", "true");
    router.push(DASHBOARD_ROUTE);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-field">
        <label htmlFor="username">Utilizator</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="admin"
        />
      </div>

      <div className="admin-form-field">
        <label htmlFor="password">Parolă</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
      </div>

      {errorText ? <p className="admin-error">{errorText}</p> : null}

      <button type="submit" className="admin-submit">
        Intră în panou
      </button>
    </form>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ role }: { role: "ADMIN" | "SUPERVISOR" | "PARTICIPANT" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        role,
      }),
    });

    let data: { error?: string; ok?: boolean } = {};
    const text = await response.text();

    if (text) {
      try {
        data = JSON.parse(text) as { error?: string; ok?: boolean };
      } catch {
        data = { error: "The server returned an unexpected response." };
      }
    }

    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>Email address</label>
        <input required type="email" name="email" autoComplete="email" />
      </div>
      <div className="field">
        <label>Password</label>
        <input required type="password" name="password" autoComplete="current-password" />
      </div>
      {error && <p className="error">{error}</p>}
      <button className="button" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Sign in…" : `Sign in as ${role.toLowerCase()}`}
      </button>
    </form>
  );
}

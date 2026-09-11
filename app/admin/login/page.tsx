"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main" className="bg-fog py-24">
      <div className="mx-auto max-w-md px-6">
        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            Admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-slate">
            Enter the admin password to view submitted leads.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/30"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-steel disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate">
            <Link href="/" className="hover:text-amber">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
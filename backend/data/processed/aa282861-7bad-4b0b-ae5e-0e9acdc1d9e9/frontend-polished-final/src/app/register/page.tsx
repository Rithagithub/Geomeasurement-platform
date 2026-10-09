"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";
import { saveToken } from "@/utils/token";
import Logo from "@/components/ui/Logo";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.register({ fullName, email, password });

      if (response.token) {
        saveToken(response.token);
        router.push("/dashboard");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to create your account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 text-paper-50 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgba(238,240,238,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <Logo dark />

        <div className="relative">
          <p className="eyebrow text-paper-50/40">Node 01 &middot; Getting started</p>
          <blockquote className="mt-4 max-w-md font-display text-3xl font-medium leading-snug">
            &ldquo;The first node is the hardest to place. Everything after it
            just connects.&rdquo;
          </blockquote>

          <ul className="mt-10 space-y-3 font-mono text-[13px] text-paper-50/50">
            <li className="flex items-center gap-3">
              <span className="node-dot" /> Adaptive courses that meet you where you are
            </li>
            <li className="flex items-center gap-3">
              <span className="node-dot" /> An AI tutor available on every concept
            </li>
            <li className="flex items-center gap-3">
              <span className="node-dot" /> A knowledge graph that grows with you
            </li>
          </ul>
        </div>

        <p className="relative eyebrow text-paper-50/30">Learning Agency &copy; 2026</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-paper-100 px-6 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>

          <p className="eyebrow text-thread-600">Start here</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Create your account</h1>
          <p className="mt-2 text-[15px] text-ink-400">Place your first node — the rest builds itself.</p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label className="field-label">Full name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-coral-500/30 bg-coral-500/10 p-3 text-sm text-coral-600">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-signal w-full">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-400">
            Already learning with us?{" "}
            <Link href="/login" className="font-semibold text-ink-900 hover:text-thread-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

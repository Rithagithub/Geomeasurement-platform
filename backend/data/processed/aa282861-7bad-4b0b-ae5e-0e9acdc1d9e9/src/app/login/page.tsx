"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";
import { saveToken } from "@/utils/token";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });

      if (response.token) {
        saveToken(response.token);
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to sign in. Check your details and try again.");
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
          <p className="eyebrow text-paper-50/40">Node 12 &middot; Reinforcement Learning</p>
          <blockquote className="mt-4 max-w-md font-display text-3xl font-medium leading-snug">
            &ldquo;Every course you finish adds a node. Every quiz strengthens an
            edge. Your graph is the map of what you actually know.&rdquo;
          </blockquote>

          <svg className="mt-10 w-full max-w-md" height="120" viewBox="0 0 400 120" fill="none" aria-hidden="true">
            <path d="M20 100 L110 40 L200 70 L290 20 L380 55" stroke="#2F8F7C" strokeOpacity="0.5" strokeWidth="1.5" />
            <circle cx="20" cy="100" r="4" fill="#EEF0EE" fillOpacity="0.5" />
            <circle cx="110" cy="40" r="4" fill="#EEF0EE" fillOpacity="0.5" />
            <circle cx="200" cy="70" r="4" fill="#EEF0EE" fillOpacity="0.5" />
            <circle cx="290" cy="20" r="6" fill="#E7A33E" />
            <circle cx="380" cy="55" r="4" fill="#EEF0EE" fillOpacity="0.5" />
          </svg>
        </div>

        <p className="relative eyebrow text-paper-50/30">Learning Agency &copy; 2026</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-paper-100 px-6 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>

          <p className="eyebrow text-thread-600">Welcome back</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Sign in to continue</h1>
          <p className="mt-2 text-[15px] text-ink-400">Pick up your learning path right where you left it.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="field-label">Password</label>
                <Link href="#" className="mb-2 text-xs text-ink-400 hover:text-ink-900">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                className="input-field"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-coral-500/30 bg-coral-500/10 p-3 text-sm text-coral-600">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-signal w-full">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-400">
            New here?{" "}
            <Link href="/register" className="font-semibold text-ink-900 hover:text-thread-600">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

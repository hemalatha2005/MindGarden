import { useEffect, useState } from "react";
import { ArrowRight, Command, LockKeyhole } from "lucide-react";
import {
  clearSession,
  getSession,
  getTrustedSession,
  requestOtp,
  saveSession,
  saveTrustedSession,
  verifyOtp,
} from "../utils/authApi";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const AuthGate = ({ children }) => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = getSession();
    if (saved?.token) setSession(saved);
  }, []);

  useEffect(() => {
    if (step !== "otp" || !otpExpiresAt) return undefined;
    const tick = () => {
      setSecondsLeft(Math.max(0, Math.ceil((new Date(otpExpiresAt).getTime() - Date.now()) / 1000)));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresAt, step]);

  const formattedTimeLeft = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    const trustedSession = getTrustedSession(normalizedEmail);
    if (trustedSession) {
      saveSession(trustedSession);
      setSession(trustedSession);
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await requestOtp(normalizedEmail);
      setPendingEmail(normalizedEmail);
      setOtpExpiresAt(result.expiresAt);
      setOtp("");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.error || "Could not send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const result = await verifyOtp(pendingEmail, otp.trim());
      const nextSession = {
        email: result.email,
        token: result.token,
        signedInAt: new Date().toISOString(),
      };
      saveSession(nextSession);
      saveTrustedSession(nextSession);
      setSession(nextSession);
    } catch (err) {
      setError(err.response?.data?.error || "Could not verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setEmail("");
    setOtp("");
    setPendingEmail("");
    setOtpExpiresAt(null);
    setSecondsLeft(0);
    setStep("email");
    setError("");
  };

  if (session) {
    return children({ onSignOut: handleSignOut });
  }

  return (
    <main className="min-h-screen bg-garden-bg text-garden-text">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_420px]">
          <section>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-garden-primary to-blue-400 text-white shadow-glow">
                <Command size={21} strokeWidth={2.4} />
              </div>
              <span className="text-xl font-semibold tracking-tight text-garden-heading">MindGarden</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-garden-heading md:text-5xl">
              Capture your thoughts before they disappear.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-garden-muted">
              A calm place for notes, tasks, reminders, and ideas. Sign in to open your garden.
            </p>
          </section>

          <section className="rounded-xl border border-garden-border bg-garden-surface p-6 shadow-card">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-garden-primary/10 text-garden-primary">
              <LockKeyhole size={21} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-garden-heading">
              {step === "email" ? "Sign in" : "Enter OTP"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-garden-muted">
              {step === "email"
                ? "Use your email to continue. OTP will be sent to your inbox."
                : `Enter the OTP sent to ${pendingEmail}.`}
            </p>

            {error && (
              <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-garden-text">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-garden-border bg-garden-bg px-3 text-sm text-garden-text outline-none focus:border-garden-primary focus:shadow-glow transition-all placeholder:text-garden-muted/40"
                    autoComplete="email"
                    autoFocus
                  />
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-garden-primary px-4 text-sm font-semibold text-white hover:bg-garden-primaryHover transition-colors"
                >
                  {isSubmitting ? "Sending OTP" : "Continue"}
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
                <div className="rounded-lg border border-garden-primary/20 bg-garden-primary/10 px-3 py-2 text-sm text-garden-primary">
                  OTP valid for <span className="font-semibold tabular-nums">{formattedTimeLeft}</span>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-garden-text">OTP</span>
                  <input
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code"
                    className="h-11 w-full rounded-lg border border-garden-border bg-garden-bg px-3 text-sm tracking-[0.3em] text-garden-text outline-none focus:border-garden-primary focus:shadow-glow transition-all placeholder:text-garden-muted/40"
                    autoFocus
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setError(""); }}
                    className="h-11 rounded-lg border border-garden-border bg-garden-surface px-4 text-sm font-semibold text-garden-text hover:bg-garden-elevated transition-colors"
                  >Back</button>
                  <button
                    type="submit"
                    disabled={isSubmitting || secondsLeft === 0}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-garden-primary px-4 text-sm font-semibold text-white hover:bg-garden-primaryHover transition-colors"
                  >
                    {isSubmitting ? "Verifying" : "Verify"}
                    <ArrowRight size={16} />
                  </button>
                </div>
                {secondsLeft === 0 && (
                  <button
                    type="button"
                    onClick={() => { setEmail(pendingEmail); setStep("email"); setError("OTP expired. Request a new one."); }}
                    className="w-full text-sm font-medium text-garden-primary hover:text-garden-primaryHover"
                  >Request a new OTP</button>
                )}
              </form>
            )}

            <p className="mt-5 text-xs leading-5 text-garden-muted">
              This device stays signed in after verification.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AuthGate;

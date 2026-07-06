import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simple redirect to home or admin based on email
      if (email.toLowerCase().includes("admin")) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between relative isolate overflow-x-hidden">
      <Navbar />

      {/* Subtle ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan/10 blur-[120px]" />

      <div className="mx-auto max-w-md w-full px-4 pt-32 pb-20 flex-1 flex items-center justify-center">
        <div className="w-full rounded-3xl border border-glass-border bg-card/70 p-8 shadow-elevated backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <span className="font-display text-2xl font-black tracking-widest bg-gradient-primary bg-clip-text text-transparent">
                SELLORA
              </span>
            </Link>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isSignUp ? "Enter your details to get started" : "Sign in to access your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-glass-border bg-background/60 pl-10 pr-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-glass-border bg-background/60 pl-10 pr-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                {!isSignUp && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to email."); }} className="text-xs text-neon-cyan hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-glass-border bg-background/60 pl-10 pr-10 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-background shadow-neon-cyan transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Tip for testing admin */}
          <div className="mt-6 rounded-xl bg-white/5 p-3 text-center text-xs text-muted-foreground border border-white/5">
            Tip: Use any email containing <span className="font-mono text-neon-cyan">admin</span> (e.g. <span className="font-mono text-foreground">admin@sellora.com</span>) to automatically sign into the Admin Dashboard.
          </div>

          {/* Footer Switch */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-neon-cyan hover:underline ml-1"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

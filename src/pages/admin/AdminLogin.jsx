import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Lock, Mail, Palette } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { login } from "../../services/authservice";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted && session) {
        navigate("/admin/dashboard", { replace: true });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.message);
      setIsLoading(false);
      return;
    }

    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-stone-950 text-white">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <Motion.div
          aria-hidden="true"
          className="absolute left-8 top-12 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <Motion.div
          aria-hidden="true"
          className="absolute bottom-10 right-8 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ y: [0, -24, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <Motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-black/30 backdrop-blur sm:p-8"
        >
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Palette size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-950">
              Welcome Artist Ganesh
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage your Om Arts catalogue.
            </p>
          </Motion.div>

          {error && (
            <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="admin@example.com"
                  className="w-full bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
                <Lock size={18} className="text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter password"
                  className="w-full bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          </div>

          <Motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Signing in..." : "Login"}
          </Motion.button>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm font-medium text-slate-500 transition hover:text-amber-600"
            >
              Back to website
            </Link>
          </div>
        </Motion.form>
      </div>
    </main>
  );
}

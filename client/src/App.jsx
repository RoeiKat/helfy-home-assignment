import { useState } from "react";
import { loginUser } from "./api";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    const errors = {};
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Enter a valid email address.";
    }

    if (!trimmedPassword) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setToken("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(email.trim(), password);
      setToken(data.token);
      setFieldErrors({});
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (fieldErrors.email) {
      setFieldErrors((currentErrors) => ({ ...currentErrors, email: "" }));
    }
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (fieldErrors.password) {
      setFieldErrors((currentErrors) => ({ ...currentErrors, password: "" }));
    }
  }

  const emailInputClass = fieldErrors.email
    ? "border-[#EF476F] focus:border-[#EF476F] focus:ring-[#EF476F]/20"
    : "border-gray-300 focus:border-[#009985] focus:ring-[#009985]/25";

  const passwordInputClass = fieldErrors.password
    ? "border-[#EF476F] focus:border-[#EF476F] focus:ring-[#EF476F]/20"
    : "border-gray-300 focus:border-[#009985] focus:ring-[#009985]/25";

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Helfy Login
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to test the authentication flow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={handleEmailChange}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${emailInputClass}`}
              placeholder="admin@example.com"
            />

            {fieldErrors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm font-medium text-[#EF476F]"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="group relative flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-[#000000] text-xs font-bold text-white">
                ?
                <div className="pointer-events-none absolute left-1/2 top-7 z-10 w-56 -translate-x-1/2 rounded-xl bg-black px-4 py-3 text-left text-xs font-normal leading-5 text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                  Default login credentials:
                  <br />
                  Email: admin@example.com
                  <br />
                  Password: admin123
                </div>
              </div>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={handlePasswordChange}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${passwordInputClass}`}
              placeholder="admin123"
            />

            {fieldErrors.password && (
              <p
                id="password-error"
                className="mt-2 text-sm font-medium text-[#EF476F]"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-[#EF476F]/30 bg-[#EF476F]/10 px-4 py-3 text-sm text-[#EF476F]">
              {error}
            </div>
          )}

          {token && (
            <div className="rounded-xl border border-[#009985]/30 bg-[#009985]/10 px-4 py-3">
              <p className="text-sm font-medium text-[#009985]">
                Login successful.
              </p>
              <p className="mt-2 break-all text-xs text-gray-600">
                Token: {token}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#009985] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#008673] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
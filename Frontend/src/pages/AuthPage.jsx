import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getApiErrorMessage } from "../api/errors";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { token, login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/gallery";

  const [mode, setMode] = useState("register");
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await api.post("/auth/register", registerForm);
      const loginRes = await api.post("/auth/login", {
        email: registerForm.email,
        password: registerForm.password,
      });
      login(loginRes.data.token);
      setSuccess("Welcome! Redirecting…");
      setRegisterForm({ name: "", email: "", password: "" });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", loginForm);
      login(res.data.token);
      setSuccess("Signed in. Redirecting…");
      setLoginForm({ email: "", password: "" });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed."));
    } finally {
      setIsLoading(false);
    }
  };

  if (token) {
    return (
      <section className="card auth-card">
        <h2>You’re signed in</h2>
        <p className="auth-lede muted">
          You can upload memories or browse the gallery from the navigation.
        </p>
        <button type="button" onClick={() => navigate("/upload")}>
          Go to upload
        </button>
      </section>
    );
  }

  return (
    <>
      <header className="topbar page-intro">
        <h1>Memory Gallery</h1>
        <p>Create an account or sign in to share photos from trips, workshops, and events.</p>
      </header>

      <section className="card auth-card">
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => {
              setMode("register");
              setError("");
              setSuccess("");
            }}
          >
            Register
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
          >
            Sign in
          </button>
        </div>

        {mode === "register" ? (
          <form className="grid-form" onSubmit={handleRegister}>
            <h2 className="auth-form-title">Create account</h2>
            <input
              placeholder="Name"
              required
              autoComplete="name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              minLength={6}
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
            />
            <button disabled={isLoading} type="submit">
              {isLoading ? "Please wait…" : "Register & continue"}
            </button>
          </form>
        ) : (
          <form className="grid-form" onSubmit={handleLogin}>
            <h2 className="auth-form-title">Sign in</h2>
            <input
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button disabled={isLoading} type="submit">
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}
      </section>
    </>
  );
}

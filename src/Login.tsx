import { useState, useEffect } from "react";
import { useNavigation } from "./NavigationContext";
import Button from "./Button";
import Input from "./Input";
import Checkbox from "./Checkbox";
import { ArrowRightIcon, EyeIcon } from "./icons";
import dmciLogo from "./assets/dmci-logo.svg";
import opcoopcIcon from "./assets/opcoops.png";
// 1400x1800 so they stay sharp in the tall panel on Retina screens.
// Sources and license: ./assets/login-photos/CREDITS.md
import towerNight from "./assets/login-photos/tower-night.jpg";
import palmPool from "./assets/login-photos/palm-pool.jpg";
import waterfrontTower from "./assets/login-photos/waterfront-tower.jpg";
import condoPool from "./assets/login-photos/condo-pool.jpg";
import greenTerraces from "./assets/login-photos/green-terraces.jpg";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const SLIDE_DURATION_MS = 6000;

// Each photo gets its own short, warm caption so the panel tells a story
// instead of just cycling pictures.
const SLIDES = [
  {
    image: towerNight,
    title: "Homes built for the way families live.",
    caption: "Every unit you present is someone's next chapter.",
  },
  {
    image: palmPool,
    title: "Every great sale starts with a conversation.",
    caption: "Your listings, clients and reservations, all in one calm place.",
  },
  {
    image: waterfrontTower,
    title: "Thank you for helping families find home.",
    caption: "We built these tools so you can focus on the people, not the paperwork.",
  },
  {
    image: condoPool,
    title: "Resort-style living, right in the city.",
    caption: "Show buyers what makes each community special.",
  },
  {
    image: greenTerraces,
    title: "Spaces that grow with every family.",
    caption: "From first viewing to turnover, we're with you at every step.",
  },
];

export default function Login() {
  const { navigate } = useNavigation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(2);
  const [loginType, setLoginType] = useState<"admin" | "user">("user");

  // Restarts whenever the slide changes, so clicking a progress bar gives
  // that slide its full duration.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [currentImageIndex]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // UI prototype: no validation, Login always goes to the dashboard.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      navigate({ screen: "dashboard" });
      setIsLoading(false);
    }, 500);
  }

  const isAdmin = loginType === "admin";
  const slide = SLIDES[currentImageIndex];

  return (
    <div className="flex min-h-screen w-full bg-white flex-col lg:h-screen lg:min-h-screen lg:flex-row lg:overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="relative isolate flex flex-col w-full lg:w-1/2 min-h-screen lg:h-full lg:min-h-0 overflow-hidden">
        {/* Soft brand glow behind the form */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-brand-100/70 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 right-[-120px] -z-10 h-[360px] w-[360px] rounded-full bg-warning-50 blur-3xl"
        />

        {/* Logo - Top Left */}
        <div className="shrink-0 px-4 py-6 sm:px-8 lg:px-12">
          <img src={dmciLogo} alt="DMCI Logo" className="h-8 w-auto" />
        </div>

        <div className="flex flex-1 min-h-0 flex-col items-center justify-center overflow-y-auto px-4 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <div className="login-rise w-full max-w-sm shrink-0 space-y-8 py-4">
            {/* Header */}
            <div className="space-y-3 text-left">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {isAdmin ? "Manage your properties" : "Sell with confidence"}
              </h1>
              <p className="text-sm text-gray-600">
                {isAdmin
                  ? "Sign in to track sales, manage listings, and support your team."
                  : "Sign in to your seller dashboard. Your clients and listings are right where you left them."}
              </p>
            </div>

            {/* Login Type Selection - sliding segmented control */}
            <div
              role="tablist"
              aria-label="Sign in as"
              className="relative grid grid-cols-2 rounded-xl bg-gray-100 p-1"
            >
              <span
                aria-hidden
                className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-out ${isAdmin ? "translate-x-full" : "translate-x-0"}`}
              />
              <button
                type="button"
                role="tab"
                aria-selected={!isAdmin}
                onClick={() => setLoginType("user")}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  !isAdmin ? "text-brand-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Seller
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isAdmin}
                onClick={() => setLoginType("admin")}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isAdmin ? "text-brand-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Admin
              </button>
            </div>

            {/* Form */}
            {/* noValidate: skip the browser's own required / email-format checks too. */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email/User ID Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {isAdmin ? "Email" : "User ID"}
                  <span className="ml-0.5 text-brand-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-gray-400">
                    {isAdmin ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-10 6L2 7" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <circle cx="9" cy="10" r="2" />
                        <path d="M15 8h2M15 12h2M7 16h10" />
                      </svg>
                    )}
                  </span>
                  <Input
                    id="email"
                    type={isAdmin ? "email" : "text"}
                    name="email"
                    size="md"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={isAdmin ? "you@dmcihomes.com" : "Enter your User ID"}
                    autoComplete="username"
                    clearable={false}
                    className="rounded-lg bg-white pl-9 shadow-xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password<span className="ml-0.5 text-brand-600">*</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-brand-600 hover:text-brand-400 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    size="md"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    clearable={false}
                    className="rounded-lg bg-white pl-9 pr-9 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <Checkbox
                  size="md"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                />
                Keep me signed in on this device
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="group w-full rounded-xl shadow-md shadow-brand-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            <div
              className={`space-y-6 ${isAdmin ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity -mt-2`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">or continue with</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" fill="#F25022" />
                    <rect x="9" y="1" width="6" height="6" fill="#7FBA00" />
                    <rect x="1" y="9" width="6" height="6" fill="#00A4EF" />
                    <rect x="9" y="9" width="6" height="6" fill="#FFB900" />
                  </svg>
                  Microsoft
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white/70 backdrop-blur px-4 sm:px-8 lg:px-12 py-3 shrink-0 text-xs text-gray-500 mt-auto">
          <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-2 sm:gap-3">
            <img
              src={opcoopcIcon}
              alt="NPC Logo"
              className="h-8 sm:h-10 w-auto shrink-0"
            />
            <span className="flex items-center gap-1.5 text-right">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success-600">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Secure sign-in · DMCI Sales © 2026
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Story carousel */}
      <div className="hidden lg:flex w-full lg:w-1/2 lg:h-full p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-brand-950">
          {SLIDES.map((s, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1500 ${index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <img
                src={s.image}
                alt={`Property ${index + 1}`}
                className={`h-full w-full object-cover ${index === currentImageIndex ? "login-kenburns" : ""}`}
              />
            </div>
          ))}

          {/* Readability gradient */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-brand-950/30" />

          {/* Top badge */}
          <div className="absolute left-6 top-6 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
            </svg>
            DMCI Homes Sales Portal
          </div>

          {/* Story */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-10">
            <div key={currentImageIndex} className="login-rise max-w-md space-y-3">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white">
                {slide.title}
              </h2>
              <p className="text-base text-white/80">{slide.caption}</p>
            </div>

            <div className="mt-8 flex gap-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className="relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/25 hover:bg-white/40"
                >
                  {index < currentImageIndex && (
                    <span className="absolute inset-0 rounded-full bg-white" />
                  )}
                  {index === currentImageIndex && (
                    <span
                      key={currentImageIndex}
                      className="login-progress absolute inset-y-0 left-0 rounded-full bg-white"
                      style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigation } from "./NavigationContext";
import Button from "./Button";
import Input from "./Input";
import { EyeIcon } from "./icons";
import dmciLogo from "./assets/dmci-logo.svg";
import opcoopcIcon from "./assets/opcoops.png";
import carousel3Cvz1 from "./assets/carousel3-Cvz1Bo5L.jpg";
import carousel4 from "./assets/carousel4-CeaP0fpH.jpg";
import carousel3Cvz2 from "./assets/carousel3-Cvz1Bo5L (1).jpg";
import carousel2 from "./assets/carousel2-CGSvuCMf.jpg";
import carousel5 from "./assets/carousel5-OqOzCcEj.jpg";

interface LoginFormData {
  email: string;
  password: string;
}

const CAROUSEL_IMAGES = [
  carousel3Cvz1,
  carousel4,
  carousel3Cvz2,
  carousel2,
  carousel5,
];

export default function Login() {
  const { navigate } = useNavigation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(2);
  const [loginType, setLoginType] = useState<"admin" | "user">("user");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="flex min-h-screen w-full bg-white flex-col lg:h-screen lg:min-h-screen lg:flex-row lg:overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="flex flex-col w-full lg:w-1/2 min-h-screen lg:h-full lg:min-h-0">
        {/* Logo - Top Left */}
        <div className="shrink-0 px-4 py-6 sm:px-8 lg:px-12">
          <img src={dmciLogo} alt="DMCI Logo" className="h-8 w-auto" />
        </div>

        <div className="flex flex-1 min-h-0 flex-col items-center justify-center overflow-y-auto px-4 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <div className="w-full max-w-xs shrink-0 space-y-8 py-4">
            {/* Header */}
            <div className="space-y-2 text-left">
              <h1 className="text-2xl font-bold text-slate-800">
                {loginType === "admin"
                  ? "Manage Your Properties"
                  : "Sell with Confidence"}
              </h1>
              <p className="text-sm text-gray-600">
                {loginType === "admin"
                  ? "Sign in to track sales, manage listings, and grow your business"
                  : "Access your seller dashboard and manage your property listings"}
              </p>
            </div>

            {/* Login Type Selection */}
            <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setLoginType("user")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  loginType === "user"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "bg-transparent text-gray-500 hover:text-gray-700"
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
                <span className="hidden sm:inline"> Seller</span>
                <span className="sm:hidden">Seller</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  loginType === "admin"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "bg-transparent text-gray-500 hover:text-gray-700"
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
                <span className="hidden sm:inline"> Admin</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>

            {/* Form */}
            {/* noValidate: skip the browser's own required / email-format checks too. */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Email/User ID Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {loginType === "admin" ? "Email" : "User ID"}
                  <span className="ml-0.5 text-brand-600">*</span>
                </label>
                <Input
                  id="email"
                  type={loginType === "admin" ? "email" : "text"}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={
                    loginType === "admin"
                      ? "Email address"
                      : "Enter your User ID"
                  }
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
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
                      className="text-sm font-medium text-brand-600 hover:text-blue-700 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      clearable={false}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div
              className={`space-y-6 ${loginType === "admin" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity -mt-2`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300" />
                <span className="text-sm font-medium text-gray-500">Or</span>
                <div className="flex-1 border-t border-gray-300" />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors"
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

        <div className="border-t border-gray-100 bg-white px-4 sm:px-8 lg:px-12 py-3 shrink-0 text-xs text-gray-500 mt-auto">
          <div className="mx-auto flex w-full max-w-xs items-center justify-between gap-2 sm:gap-3">
            <img
              src={opcoopcIcon}
              alt="NPC Logo"
              className="h-8 sm:h-10 w-auto shrink-0"
            />
            <span className="text-right">
              DMCI Sales @2026 All Rights Reserved
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Carousel */}
      <div className="hidden lg:flex w-full lg:w-1/2 lg:h-full items-center justify-center overflow-hidden bg-[#FAFAFA] p-5">
        <div className="relative w-full max-w-[585px] h-full max-h-[698px] rounded-3xl overflow-hidden bg-white p-5">
          <div className="relative w-full h-full">
            {CAROUSEL_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1500 rounded-2xl overflow-hidden ${index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              >
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {CAROUSEL_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`transition-all duration-300 rounded-full h-1 cursor-pointer ${index === currentImageIndex ? "w-11 bg-white" : "w-8 bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

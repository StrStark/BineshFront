import { useState, useRef, useEffect } from "react";
import { Phone, ArrowRight, Shield, HelpCircle, Mail, MessageSquare, X, Sun, Moon } from "lucide-react";
import svgPaths from "../../imports/svg-lkj34ktpju";
import imgMoonAndStars from "figma:asset/27bb79d6090e7d398ac0df5f4fd148d65b24431d.png";
import { imgRectangle34624214 } from "../../imports/svg-zgd3h";
import { useTheme } from "../contexts/ThemeContext";

interface LoginPageProps {
  setIsLoggedIn: (value: boolean) => void;
}

export function LoginPage({ setIsLoggedIn }: LoginPageProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsModalTab, setTermsModalTab] = useState<"terms" | "privacy">("terms");
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 11) {
      alert("لطفا شماره موبایل را به درستی وارد کنید");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
    setTimer(120); // 2 minutes
    
    // Focus first OTP input
    setTimeout(() => {
      otpInputs.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length, 5);
    otpInputs.current[lastFilledIndex]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      alert("لطفا کد 6 رقمی را کامل وارد کنید");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Navigate to dashboard
    setIsLoggedIn(true);
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setTimer(120);
    setOtp(["", "", "", "", "", ""]);
    otpInputs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-[#0e1526] relative overflow-hidden flex items-center justify-center transition-colors duration-300" dir="rtl">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 left-6 z-20 w-14 h-14 rounded-full bg-white dark:bg-[#1a1f2e] border-2 border-[#e8e8e8] dark:border-[#2a3142] shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        {isDarkMode ? (
          <Sun className="w-7 h-7 text-[#fbbf24] group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon className="w-7 h-7 text-[#0e1b27] group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>

      {/* Background Pattern */}
      <div className="absolute h-[941.245px] left-[10%] top-[-30px] w-[827.092px] opacity-40">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 828.092 942.245">
          <g>
            <path d={svgPaths.p2678de80} stroke="url(#paint0_linear_5_6406)" strokeOpacity="0.12" />
            <path d={svgPaths.pab3d100} stroke="url(#paint1_linear_5_6406)" strokeOpacity="0.12" />
            <path d={svgPaths.p35ce2a30} stroke="url(#paint2_linear_5_6406)" strokeOpacity="0.12" />
            <path d={svgPaths.p268b2080} stroke="url(#paint3_linear_5_6406)" strokeOpacity="0.12" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
          </defs>
        </svg>
      </div>


      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[450px] mx-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="bg-[#0e1b27] dark:bg-white h-[84px] w-[94px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[12px_11px] mask-size-[60px_68.281px] transition-colors duration-300" 
                 style={{ maskImage: `url('${imgRectangle34624214}')` }} />
          </div>
          
          <h1 className="text-center mb-2">
            <span className="text-xl text-[#0e1526] dark:text-white">پنل مدیریتی </span>
            <span className="text-4xl font-bold text-[#0e1b27] dark:text-white">رهـگـیـر</span>
          </h1>
          
          <div className="flex items-center gap-2 text-xs text-[#0e1526] dark:text-[#8ca3b8]">
            <div className="h-[1px] w-[30px] bg-[#0e1b27] dark:bg-white"></div>
            <span>سیستم هوشمند مدیریت داده‌ها</span>
            <div className="h-[1px] w-[30px] bg-[#0e1b27] dark:bg-white"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-[#e8e8e8] dark:border-[#2a3142] p-8 shadow-lg transition-colors duration-300">
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-lg font-semibold text-[#0e1526] dark:text-white">
                  ورود به سیستم رهگیر
                </h2>
                <p className="text-sm text-[#0e1526]/70 dark:text-[#8ca3b8]">
                  لطفا جهت ورود به نرم افزار شماره موبایل خود را وارد نمایید.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#0e1526] dark:text-white">
                  شماره موبایل
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8ca3b8]" />
                  <input
                    type="tel"
                    placeholder="09123456789"
                    className="w-full h-[50px] bg-transparent border border-[#0e1526] dark:border-[#2a3142] rounded-lg pr-11 pl-4 text-sm text-[#0e1526] dark:text-white placeholder:text-[#8ca3b8] outline-none focus:border-[#0e1b27] dark:focus:border-[#0085ff] transition-colors"
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    maxLength={11}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phoneNumber.length !== 11}
                className="w-full h-[50px] bg-[#0e1b27] dark:bg-[#0085ff] text-white rounded-lg font-semibold hover:bg-[#1a2838] dark:hover:bg-[#0066cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "ارسال کد تایید"
                )}
              </button>

              <p className="text-[10px] text-center text-[#8ca3b8]">
                ورود شما به معنای پذیرش{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTermsModalTab("terms");
                    setShowTermsModal(true);
                  }}
                  className="text-[#0e1b27] dark:text-white font-medium hover:underline text-[10px]"
                >
                  شرایط شرکت بینش‌افزار آتی‌نگر
                </button>
                {" "}و{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTermsModalTab("privacy");
                    setShowTermsModal(true);
                  }}
                  className="text-[#0e1b27] dark:text-white font-medium hover:underline text-[10px]"
                >
                  قوانین حریم‌خصوصی
                </button>
                {" "}است.
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp(["", "", "", "", "", ""]);
                    setTimer(0);
                  }}
                  className="flex items-center gap-2 text-sm text-[#0e1526] dark:text-white hover:text-[#0085ff] dark:hover:text-[#0085ff] transition-colors mb-4"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت</span>
                </button>

                <div className="text-center space-y-2 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-[#0e1b27]/10 dark:bg-[#0085ff]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#0e1b27] dark:text-[#0085ff]" />
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-[#0e1526] dark:text-white">
                    کد تایید را وارد کنید
                  </h2>
                  <p className="text-sm text-[#0e1526]/70 dark:text-[#8ca3b8]">
                    کد 6 رقمی به شماره <span dir="ltr" className="font-semibold text-[#0e1526] dark:text-white">{phoneNumber}</span> ارسال شد
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-2" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-xl font-semibold bg-[#f7f9fb] dark:bg-[#252b3d] border-2 border-[#e8e8e8] dark:border-[#2a3142] rounded-lg text-[#0e1526] dark:text-white outline-none focus:border-[#0e1b27] dark:focus:border-[#0085ff] transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full h-[50px] bg-[#0e1b27] dark:bg-[#0085ff] text-white rounded-lg font-semibold hover:bg-[#1a2838] dark:hover:bg-[#0066cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "تایید و ورود"
                )}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-[#8ca3b8]">
                    ارسال مجدد کد تا{" "}
                    <span className="font-semibold text-[#0e1526] dark:text-white" dir="ltr">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm text-[#0e1b27] dark:text-[#0085ff] font-medium hover:underline disabled:opacity-50"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>

              <p className="text-[10px] text-center text-[#8ca3b8]">
                کد را دریافت نکردید؟{" "}
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-[#0e1b27] dark:text-white font-medium hover:underline"
                >
                  تغییر شماره موبایل
                </button>
              </p>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#e8e8e8] dark:border-[#2a3142] text-center">
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="text-sm text-[#0e1526] dark:text-white hover:text-[#0085ff] dark:hover:text-[#0085ff] transition-colors"
            >
              ‌نمی‌توانم وارد شوم!
            </button>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowSupportModal(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none" dir="rtl">
            <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-[#e8e8e8] dark:border-[#2a3142] w-full max-w-[500px] pointer-events-auto animate-fadeIn shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#e8e8e8] dark:border-[#2a3142]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0085ff]/10 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-[#0085ff]" />
                  </div>
                  <h2 className="text-lg text-[#1c1c1c] dark:text-white">
                    راهنمای ورود و پشتیبانی
                  </h2>
                </div>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="text-[#585757] dark:text-[#8b92a8] hover:text-[#e92c2c] dark:hover:text-[#e92c2c] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Help Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-[#1c1c1c] dark:text-white">
                    مشکلات متداول
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-[#f7f9fb] dark:bg-[#252b3d] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142]">
                      <p className="text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                        کد تایید را دریافت نکردم
                      </p>
                      <p className="text-xs text-[#585757] dark:text-[#8b92a8]">
                        لطفاً شماره موبایل خود را بررسی کرده و مطمئن شوید که صحیح وارد شده است. همچنین پیامک‌های هرزنامه خود را نیز بررسی کنید.
                      </p>
                    </div>

                    <div className="p-4 bg-[#f7f9fb] dark:bg-[#252b3d] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142]">
                      <p className="text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                        کد تایید منقضی شده است
                      </p>
                      <p className="text-xs text-[#585757] dark:text-[#8b92a8]">
                        از گزینه "ارسال مجدد کد" استفاده کنید تا کد جدیدی برای شما ارسال شود.
                      </p>
                    </div>

                    <div className="p-4 bg-[#f7f9fb] dark:bg-[#252b3d] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142]">
                      <p className="text-sm font-medium text-[#1c1c1c] dark:text-white mb-2">
                        حساب کاربری ندارم
                      </p>
                      <p className="text-xs text-[#585757] dark:text-[#8b92a8]">
                        برای دریافت حساب کاربری با پشتیبانی تماس بگیرید.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-[#1c1c1c] dark:text-white">
                    راه‌های ارتباطی
                  </h3>

                  <div className="space-y-3">
                    <a
                      href="tel:02188888888"
                      className="flex items-center gap-3 p-4 bg-[#e6f3ff] dark:bg-[#1a2a3a] rounded-lg border border-[#0085ff] dark:border-[#0066cc] hover:bg-[#d9edff] dark:hover:bg-[#1f2f3f] transition-colors"
                    >
                      <Phone className="w-5 h-5 text-[#0085ff]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1c1c1c] dark:text-white">
                          تلفن پشتیبانی
                        </p>
                        <p className="text-xs text-[#585757] dark:text-[#8b92a8]" dir="ltr">
                          021-8888-8888
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:support@rahgir.com"
                      className="flex items-center gap-3 p-4 bg-[#f7f9fb] dark:bg-[#252b3d] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142] hover:bg-[#eef2f6] dark:hover:bg-[#2a3142] transition-colors"
                    >
                      <Mail className="w-5 h-5 text-[#0085ff]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1c1c1c] dark:text-white">
                          ایمیل پشتیبانی
                        </p>
                        <p className="text-xs text-[#585757] dark:text-[#8b92a8]" dir="ltr">
                          support@rahgir.com
                        </p>
                      </div>
                    </a>

                    <div className="flex items-center gap-3 p-4 bg-[#f7f9fb] dark:bg-[#252b3d] rounded-lg border border-[#e8e8e8] dark:border-[#2a3142]">
                      <MessageSquare className="w-5 h-5 text-[#0085ff]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1c1c1c] dark:text-white">
                          ساعات پاسخگویی
                        </p>
                        <p className="text-xs text-[#585757] dark:text-[#8b92a8]">
                          شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowTermsModal(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none" dir="rtl">
            <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-[#e8e8e8] dark:border-[#2a3142] w-full max-w-[600px] max-h-[80vh] pointer-events-auto animate-fadeIn shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#e8e8e8] dark:border-[#2a3142]">
                <h2 className="text-lg text-[#1c1c1c] dark:text-white font-semibold">
                  {termsModalTab === "terms" ? "شرایط شرکت بینش‌افزار آتی‌نگر" : "قوانین حریم‌خصوصی"}
                </h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-[#585757] dark:text-[#8b92a8] hover:text-[#e92c2c] dark:hover:text-[#e92c2c] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#e8e8e8] dark:border-[#2a3142]">
                <button
                  onClick={() => setTermsModalTab("terms")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    termsModalTab === "terms"
                      ? "text-[#0085ff] border-b-2 border-[#0085ff]"
                      : "text-[#585757] dark:text-[#8b92a8] hover:text-[#0e1526] dark:hover:text-white"
                  }`}
                >
                  شرایط استفاده
                </button>
                <button
                  onClick={() => setTermsModalTab("privacy")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    termsModalTab === "privacy"
                      ? "text-[#0085ff] border-b-2 border-[#0085ff]"
                      : "text-[#585757] dark:text-[#8b92a8] hover:text-[#0e1526] dark:hover:text-white"
                  }`}
                >
                  حریم خصوصی
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {termsModalTab === "terms" ? (
                  <div className="space-y-4 text-sm text-[#585757] dark:text-[#8b92a8]">
                    <h3 className="font-semibold text-[#1c1c1c] dark:text-white text-base mb-3">
                      شرایط و ضوابط استفاده از سیستم رهگیر
                    </h3>
                    
                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۱. پذیرش شرایط</p>
                      <p>
                        با استفاده از سیستم رهگیر، شما تمامی شرایط و ضوابط ذکر شده در این سند را می‌پذیرید. 
                        در صورت عدم پذیرش این شرایط، لطفاً از استفاده از سیستم خودداری نمایید.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۲. تعریف کاربر</p>
                      <p>
                        کاربر، هر شخص حقیقی یا حقوقی است که با استفاده از اطلاعات ورود خود، به سیستم دسترسی پیدا می‌کند.
                        مسئولیت حفظ اطلاعات ورود به عهده کاربر می‌باشد.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۳. محدودیت‌های استفاده</p>
                      <p>
                        کاربر متعهد می‌شود که از سیستم تنها برای اهداف قانونی استفاده کرده و هرگونه سوء استفاده از خدمات 
                        می‌تواند منجر به لغو دسترسی کاربر گردد.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۴. مالکیت معنوی</p>
                      <p>
                        تمامی حقوق مالکیت معنوی سیستم رهگیر متعلق به شرکت بینش‌افزار آتی‌نگر می‌باشد و هرگونه کپی‌برداری 
                        یا استفاده غیرمجاز پیگرد قانونی خواهد داشت.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۵. تغییرات در شرایط</p>
                      <p>
                        شرکت بینش‌افزار آتی‌نگر این حق را برای خود محفوظ می‌دارد که در هر زمان، شرایط استفاده را بدون اطلاع قبلی تغییر دهد.
                        ادامه استفاده از سیستم پس از اعمال تغییرات به معنای پذیرش شرایط جدید می‌باشد.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۶. محدودیت مسئولیت</p>
                      <p>
                        شرکت بینش‌افزار آتی‌نگر در قبال هرگونه خسارت مستقیم یا غیرمستقیم ناشی از استفاده یا عدم امکان استفاده از سیستم 
                        مسئولیتی نخواهد داشت.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm text-[#585757] dark:text-[#8b92a8]">
                    <h3 className="font-semibold text-[#1c1c1c] dark:text-white text-base mb-3">
                      سیاست حفظ حریم خصوصی
                    </h3>
                    
                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۱. جمع‌آوری اطلاعات</p>
                      <p>
                        ما اطلاعات شخصی شما شامل نام، شماره تماس، آدرس ایمیل و سایر اطلاعات لازم برای ارائه خدمات را جمع‌آوری می‌کنیم.
                        این اطلاعات تنها برای بهبود کیفیت خدمات و ارتباط با شما استفاده خواهد شد.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۲. استفاده از اطلاعات</p>
                      <p>
                        اطلاعات شخصی شما برای موارد زیر استفاده می‌شود:
                      </p>
                      <ul className="list-disc mr-5 mt-2 space-y-1">
                        <li>احراز هویت و دسترسی به سیستم</li>
                        <li>بهبود کیفیت خدمات</li>
                        <li>ارسال اطلاعیه‌ها و به‌روزرسانی‌های مهم</li>
                        <li>پشتیبانی فنی و خدمات مشتریان</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۳. حفاظت از اطلاعات</p>
                      <p>
                        ما از روش‌های امنیتی پیشرفته برای حفاظت از اطلاعات شما استفاده می‌کنیم. تمامی داده‌ها به صورت رمزنگاری شده 
                        ذخیره و منتقل می‌شوند.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۴. اشتراک‌گذاری اطلاعات</p>
                      <p>
                        ما اطلاعات شخصی شما را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم، مگر در موارد زیر:
                      </p>
                      <ul className="list-disc mr-5 mt-2 space-y-1">
                        <li>با رضایت صریح شما</li>
                        <li>در صورت الزام قانونی</li>
                        <li>برای حفاظت از حقوق و امنیت م</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۵. کوکی‌ها</p>
                      <p>
                        ما از کوکی‌ها برای بهبود تجربه کاربری و تحلیل استفاده از سیستم استفاده می‌کنیم. شما می‌توانید استفاده از کوکی‌ها را 
                        در تنظیمات مرورگر خود غیرفعال کنید.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۶. حقوق کاربر</p>
                      <p>
                        شما حق دارید به اطلاعات شخصی خود دسترسی داشته باشید، آن‌ها را ویرایش کنید یا درخواست حذف آن‌ها را بدهید.
                        برای اعمال این حقوق، لطفاً با پشتیبانی تماس بگیرید.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#1c1c1c] dark:text-white mb-2">۷. تغییرات در سیاست</p>
                      <p>
                        ما ممکن است این سیاست را به‌روزرسانی کنیم. در صورت تغییرات مهم، از طریق ایمیل یا اطلاعیه در سیستم به شما اطلاع خواهیم داد.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#e8e8e8] dark:border-[#2a3142]">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full h-[45px] bg-[#0e1b27] dark:bg-[#0085ff] text-white rounded-lg font-medium hover:bg-[#1a2838] dark:hover:bg-[#0066cc] transition-colors"
                >
                  متوجه شدم
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
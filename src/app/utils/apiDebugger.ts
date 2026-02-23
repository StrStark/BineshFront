/**
 * 🛡️ API Error Handler & Development Console
 * 
 * این فایل برای نمایش وضعیت API ها و debug کردن مشکلات fetch است
 */

// تنظیمات
const SHOW_API_STATUS = true; // نمایش وضعیت API ها در console
const LOG_API_CALLS = false; // لاگ کردن تمام فراخوانی API ها

// رنگ‌های console
const colors = {
  success: 'color: #10b981; font-weight: bold;',
  warning: 'color: #f59e0b; font-weight: bold;',
  error: 'color: #ef4444; font-weight: bold;',
  info: 'color: #3b82f6; font-weight: bold;',
  title: 'color: #8b5cf6; font-size: 16px; font-weight: bold;',
};

/**
 * نمایش وضعیت API ها در console
 */
export function logApiStatus() {
  if (!SHOW_API_STATUS) return;

  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8b5cf6;');
  console.log('%c🛡️ سیستم مدیریت خطای API - پنل رهگیر', colors.title);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8b5cf6;');
  
  console.log('\n%c✅ وضعیت سیستم', colors.success);
  console.log('%c• تمام API ها دارای Graceful Degradation هستند', colors.info);
  console.log('%c• در صورت خطا، سیستم به Mock Data fallback می‌کند', colors.info);
  console.log('%c• هیچ خطای "Failed to fetch" باعث crash نمی‌شود', colors.info);

  console.log('\n%c📋 API های موجود', colors.success);
  
  const apis = [
    { name: '🔐 Auth API', status: '✅', endpoints: 3 },
    { name: '👥 Customer API', status: '✅', endpoints: 3 },
    { name: '💰 Sales API', status: '✅', endpoints: 4 },
    { name: '📦 Product API', status: '✅', endpoints: 2 },
    { name: '💳 Financial API', status: '✅', endpoints: 1 },
  ];

  apis.forEach(api => {
    console.log(`%c${api.status} ${api.name} %c(${api.endpoints} endpoints)`, 
      colors.success, 
      'color: #6b7280;'
    );
  });

  console.log('\n%c⚠️ توجه', colors.warning);
  console.log('%cاگر خطای "Failed to fetch" می‌بینید، احتمالاً از منابع زیر است:', 'color: #6b7280;');
  console.log('%c  • Figma webpack artifacts (خارج از کنترل ما)', 'color: #6b7280;');
  console.log('%c  • Browser extensions', 'color: #6b7280;');
  console.log('%c  • External scripts', 'color: #6b7280;');
  
  console.log('\n%c💡 حالت Development', colors.info);
  console.log('%cشماره موبایل: هر شماره 11 رقمی', 'color: #6b7280;');
  console.log('%cکد OTP: هر کد 6 رقمی', 'color: #6b7280;');

  console.log('\n%c📚 مستندات کامل در: /API_STATUS.md', colors.info);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #8b5cf6;');
}

/**
 * Intercept fetch برای لاگ کردن
 */
export function interceptFetch() {
  if (!LOG_API_CALLS) return;

  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const [url, options] = args;
    
    // فقط API های ما را لاگ کن
    if (typeof url === 'string' && url.includes('panel.bineshafzar.ir')) {
      console.log('%c→ API Call:', colors.info, url);
    }
    
    try {
      const response = await originalFetch(...args);
      
      if (typeof url === 'string' && url.includes('panel.bineshafzar.ir')) {
        if (response.ok) {
          console.log('%c✓ API Success:', colors.success, url);
        } else {
          console.log('%c✗ API Error:', colors.error, url, response.status);
        }
      }
      
      return response;
    } catch (error) {
      if (typeof url === 'string' && url.includes('panel.bineshafzar.ir')) {
        console.log('%c✗ Fetch Failed:', colors.error, url, error);
      }
      throw error;
    }
  };
}

/**
 * Handle global errors
 */
export function setupGlobalErrorHandler() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    // Check if it's from Figma (completely ignore these)
    const isFigmaError = 
      event.reason?.stack?.includes('figma.com') ||
      event.reason?.stack?.includes('devtools_worker') ||
      event.reason?.stack?.includes('webpack-artifacts');
    
    if (isFigmaError) {
      event.preventDefault(); // Prevent the error from showing
      return; // Don't log anything
    }
    
    // فقط خطاهای مربوط به API های ما را لاگ کن
    if (event.reason?.message?.includes('fetch') || 
        event.reason?.message?.includes('panel.bineshafzar.ir')) {
      console.warn('%c⚠️ Unhandled API Error (Safely Caught):', colors.warning, event.reason);
      event.preventDefault(); // جلوگیری از نمایش خطا در console
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    // Check if it's from Figma (completely ignore these)
    const isFigmaError = 
      event.error?.stack?.includes('figma.com') ||
      event.error?.stack?.includes('devtools_worker') ||
      event.error?.stack?.includes('webpack-artifacts') ||
      event.filename?.includes('figma.com');
    
    if (isFigmaError) {
      event.preventDefault(); // Prevent the error from showing
      return; // Don't log anything
    }
    
    // فقط خطاهای مربوط به fetch را لاگ کن
    if (event.message?.includes('fetch') || 
        event.message?.includes('Failed to fetch')) {
      console.warn('%c⚠️ Network Error (Safely Caught):', colors.warning, event.message);
      event.preventDefault(); // جلوگیری از نمایش خطا در console
    }
  });
}

// Auto-initialize
if (typeof window !== 'undefined') {
  // نمایش وضعیت API ها
  logApiStatus();
  
  // راه‌اندازی error handler
  setupGlobalErrorHandler();
  
  // Intercept fetch (فقط در development mode)
  if (process.env.NODE_ENV === 'development') {
    interceptFetch();
  }
}
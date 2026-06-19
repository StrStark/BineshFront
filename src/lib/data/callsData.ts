export type CallStatus =
  | "answered_by_customer"
  | "answered_by_agent"
  | "rejected_by_customer"
  | "rejected_by_agent"
  | "no_answer_customer"
  | "no_answer_agent";

export type CallType = "incoming" | "outgoing";

export interface CallRecord {
  id: number;
  agent: string;
  customer: string;
  date: string;
  time: string;
  duration: string;
  status: CallStatus;
  callType: CallType;
  rating: number;
  recording?: string;
  audioUrl?: string;
  transcript?: string;
  notes?: string;
}

export const statusLabels: Record<CallStatus, string> = {
  answered_by_customer: "پاسخ توسط مشتری",
  answered_by_agent: "پاسخ توسط کارشناس",
  rejected_by_customer: "رد توسط مشتری",
  rejected_by_agent: "رد توسط کارشناس",
  no_answer_customer: "عدم پاسخ مشتری",
  no_answer_agent: "عدم پاسخ کارشناس",
};

// تولید داده‌های تصادفی برای تماس‌ها
export const generateCalls = (): CallRecord[] => {
  const agents = [
    "آقای جابر یوسفی", "خانم مژگان رضایی", "آقای رضا کریمی", "خانم زهرا محمودی",
    "آقای حسین نوری", "خانم مریم صادقی", "آقای امیر جعفری", "خانم لیلا میرزایی",
    "آقای پویا رستمی", "خانم نگار حیدری", "آقای سعید طاهری", "خانم سمیرا فتحی",
    "آقای مهدی باقری", "خانم الهام کاظمی", "آقای بهزاد ملکی", "خانم نیلوفر اسدی"
  ];
  
  const customers = [
    "آقای علی محمدی", "خانم سارا احمدی", "آقای محمد رضایی", "خانم فاطمه کریمی",
    "آقای حسین قاسمی", "خانم زهرا حسینی", "آقای احمد نوری", "خانم مریم موسوی",
    "آقای رضا صادقی", "خانم نرگس اکبری", "آقای مهدی جعفری", "خانم الهام میرزایی",
    "آقای امیر علیپور", "خانم نازنین خانی", "آقای حامد زارعی", "خانم سمیرا ملکی",
    "آقای کامران باقری", "خانم لیلا یوسفی", "آقای بهزاد فتحی", "خانم شیرین عباسی"
  ];
  
  const statuses: CallStatus[] = [
    "answered_by_customer", "answered_by_customer", "answered_by_customer",
    "answered_by_agent", "answered_by_agent",
    "rejected_by_customer", "rejected_by_agent",
    "no_answer_customer", "no_answer_agent"
  ];
  
  const callTypes: CallType[] = ["incoming", "outgoing"];
  
  const calls: CallRecord[] = [];
  
  for (let i = 1; i <= 150; i++) {
    const hour = String(Math.floor(Math.random() * 10) + 8).padStart(2, '0');
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const durationMinutes = Math.floor(Math.random() * 5);
    const durationSeconds = Math.floor(Math.random() * 60);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const callType = callTypes[Math.floor(Math.random() * callTypes.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    // تولید تاریخ تصادفی
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const month = String(Math.floor(Math.random() * 3) + 7).padStart(2, '0'); // مهر تا آذر
    const year = 1403;
    
    let duration = "";
    if (durationMinutes > 0) {
      duration = `${durationMinutes} دقیقه و ${durationSeconds} ثانیه`;
    } else {
      duration = `${durationSeconds} ثانیه`;
    }
    
    const hasRecording = Math.random() > 0.5 && (status === "answered_by_customer" || status === "answered_by_agent");
    
    calls.push({
      id: i,
      agent: agents[Math.floor(Math.random() * agents.length)],
      customer: customers[Math.floor(Math.random() * customers.length)],
      date: `${year}/${month}/${day}`,
      time: `${hour}:${minute}`,
      duration: duration,
      status: status,
      callType: callType,
      rating: rating,
      recording: hasRecording ? (Math.random() > 0.7 ? "پخش - مدیران مالی" : "در حال بارگذاری") : undefined,
      audioUrl: hasRecording ? `/audio/call-${i}.mp3` : undefined,
      transcript: hasRecording ? "کارشناس: سلام، وقت بخیر. چطور می‌تونم کمکتون کنم?\n\nمشتری: سلام، در مورد محصول سوال داشتم.\n\nکارشناس: بله حتماً، خوشحال میشم کمکتون کنم." : undefined,
    });
  }
  
  return calls;
};

// داده‌های تماس‌ها - این در واقع یک singleton است که در تمام اپلیکیشن استفاده می‌شود
let callsDataInstance: CallRecord[] | null = null;

export const getCallsData = (): CallRecord[] => {
  if (!callsDataInstance) {
    callsDataInstance = generateCalls();
  }
  return callsDataInstance;
};

// تابع برای فیلتر کردن تماس‌ها بر اساس نام مشتری
export const getCallHistoryByCustomer = (customerName: string): CallRecord[] => {
  const allCalls = getCallsData();
  return allCalls.filter(call => call.customer === customerName);
};

// اضافه کردن فیلد notes برای interface
export interface CallHistoryItem {
  id: number;
  date: string;
  time: string;
  duration: string;
  status: string;
  agent: string;
  notes?: string;
}
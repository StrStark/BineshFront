// Auth API and Cookie Management

const API_BASE_URL = 'https://panel.bineshafzar.ir/api';
const AUTH_BEARER_TOKEN = "vlkjhgfdcszfghjkl";

export interface SignInResponse {
  code: number;
  status: string;
  message: string;
}

export interface ConfirmSignInResponse {
  code: number;
  status: string;
  message: string;
  body: {
    id: string;
    accessToken: string;
    refreshToken: string;
    userSessionId: string;
    expires: string;
    created: string;
    userId: string;
  };
}

// Cookie management functions
export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Auth API functions
export const authApi = {
  signIn: async (phoneNumber: string): Promise<SignInResponse> => {
    const response = await fetch(`${API_BASE_URL}/Auth/SignIn`, {
      method: 'POST',
      headers: {
        'accept': 'application/json;odata.metadata=minimal;odata.streaming=true',
        'Authorization': `Bearer ${AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok || data.code !== 200) {
      throw new Error(data.message || 'خطا در ارسال کد تایید');
    }

    return data;
  },

  verifyOtp: async (
    phoneNumber: string,
    token: string,
    deviceInfo: string = 'Web Browser',
    location: string = 'Iran',
    application: string = 'Binesh Panel'
  ): Promise<ConfirmSignInResponse> => {
    const response = await fetch(`${API_BASE_URL}/Auth/ConfirmSignInPhone`, {
      method: 'POST',
      headers: {
        'accept': 'application/json;odata.metadata=minimal;odata.streaming=true',
        'Authorization': `Bearer ${AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
      body: JSON.stringify({
        phoneNumber,
        token,
        deviceInfo,
        location,
        application,
      }),
    });

    const data: ConfirmSignInResponse = await response.json();

    if (!response.ok || data.code !== 200) {
      throw new Error(data.message || 'کد تایید نادرست است');
    }
    
    // Save tokens to cookies - using "authToken" as the key since other APIs use it
    if (data.body && data.body.accessToken) {
      setCookie('authToken', data.body.accessToken, 7);
      setCookie('refreshToken', data.body.refreshToken, 30);
      setCookie('userId', data.body.userId, 30);
      setCookie('userSessionId', data.body.userSessionId, 30);
    }

    return data;
  },

  confirmSignIn: async (
    phoneNumber: string,
    token: string,
    deviceInfo: string = 'Web Browser',
    location: string = 'Iran',
    application: string = 'Binesh Panel'
  ): Promise<ConfirmSignInResponse> => {
    const response = await fetch(`${API_BASE_URL}/Auth/ConfirmSignInPhone`, {
      method: 'POST',
      headers: {
        'accept': 'application/json;odata.metadata=minimal;odata.streaming=true',
        'Authorization': `Bearer ${AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
      body: JSON.stringify({
        phoneNumber,
        token,
        deviceInfo,
        location,
        application,
      }),
    });

    const data: ConfirmSignInResponse = await response.json();

    if (!response.ok || data.code !== 200) {
      throw new Error(data.message || 'کد تایید نادرست است');
    }
    
    // Save tokens to cookies - using "authToken" as the key since other APIs use it
    if (data.body && data.body.accessToken) {
      setCookie('authToken', data.body.accessToken, 7);
      setCookie('refreshToken', data.body.refreshToken, 30);
      setCookie('userId', data.body.userId, 30);
      setCookie('userSessionId', data.body.userSessionId, 30);
    }

    return data;
  },

  logout: () => {
    deleteCookie('authToken');
    deleteCookie('refreshToken');
    deleteCookie('userId');
    deleteCookie('userSessionId');
  },

  isAuthenticated: (): boolean => {
    const authToken = getCookie('authToken');
    return !!authToken;
  },

  getAccessToken: (): string | null => {
    return getCookie('authToken');
  },
};
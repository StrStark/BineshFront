"use client";

/**
 * Copy text to clipboard with fallback for environments where Clipboard API is blocked
 * @param text - The text to copy
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first (only if permissions are available)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Silently fall back to execCommand - no warning needed
      // This is expected in some environments due to permissions policy
    }
  }

  // Fallback to execCommand for older browsers or when Clipboard API is blocked
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible and prevent scrolling
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // Select the text
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      // iOS specific selection
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}
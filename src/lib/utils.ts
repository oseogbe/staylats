import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Helper function to get plain text length from HTML string
// Strips HTML tags and gets the actual text content length
// This matches the behavior of TipTap's editor.getText().length
export function getPlainTextLength(html: string) {
  if (!html || html === '') return 0;
  
  // Create a temporary element to parse HTML and extract text content
  // This approach accurately matches browser text extraction
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent?.trim().length || 0;
  }
  
  // Fallback for non-browser environments (shouldn't happen in React client)
  // Remove HTML tags and decode common HTML entities
  const text = html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Decode &amp;
    .replace(/&lt;/g, '<') // Decode &lt;
    .replace(/&gt;/g, '>') // Decode &gt;
    .replace(/&quot;/g, '"') // Decode &quot;
    .replace(/&#39;/g, "'") // Decode &#39;
    .replace(/&[a-z]+;/gi, '') // Remove other HTML entities
    .trim();
  return text.length;
}
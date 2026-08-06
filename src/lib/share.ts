export interface ShareContent {
  /** Absolute URL — relative links are useless once they leave the tab */
  url: string;
  title: string;
  /** Message put in front of the link on networks that carry one */
  text?: string;
}

/**
 * Web share endpoints, per network.
 *
 * Instagram has none: it accepts no pre-filled link from the web, by design.
 * Sharing there goes through the OS share sheet or the clipboard - see
 * `shareNatively` and `copyToClipboard`.
 */
export const buildShareLinks = ({ url, text, title }: ShareContent) => {
  const message = text || title;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
  };
};

/** Opens a share endpoint without handing the opened tab a reference back. */
export const openShareWindow = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};

export const copyToClipboard = async (value: string): Promise<boolean> => {
  try {
    // Only available over https and on localhost
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    // Fallback for insecure origins, e.g. the dev server over a LAN address
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
};

export type NativeShareResult = "shared" | "dismissed" | "unsupported";

/**
 * The OS share sheet, which is the only route to apps with no web endpoint
 * (Instagram among them). Absent on most desktop browsers.
 */
export const shareNatively = async (
  content: ShareContent
): Promise<NativeShareResult> => {
  if (!navigator.share) return "unsupported";

  try {
    await navigator.share({
      title: content.title,
      text: content.text,
      url: content.url,
    });
    return "shared";
  } catch {
    // Thrown when the user closes the sheet, and on permission errors
    return "dismissed";
  }
};

/** Absolute, canonical link to a listing — no query string, safe to paste. */
export const buildListingShareUrl = (slug: string) =>
  `${window.location.origin}/property/${slug}`;

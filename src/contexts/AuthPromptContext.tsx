import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import AuthModal from "@/components/auth/AuthModal";

export interface AuthPromptOptions {
  /** Navigated to once auth completes */
  redirectPath?: string;
  /** Passed as `navigate(redirectPath, { state })` */
  redirectState?: unknown;
  /**
   * Run once the user is signed in - for resuming whatever they were doing
   * when the prompt interrupted them, e.g. saving the listing they clicked.
   */
  onSuccess?: () => void;
}

type AuthPromptContextValue = {
  open: boolean;
  /** Opens the login modal. Callers should check `isAuthenticated` first. */
  openAuthPrompt: (options?: AuthPromptOptions) => void;
  closeAuthPrompt: () => void;
};

const AuthPromptContext = createContext<AuthPromptContextValue | null>(null);

/**
 * Hosts the login modal at app level so any component can ask the user to sign
 * in - the modal used to live in the Navbar's local state, which put it out of
 * reach of everything else.
 */
export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AuthPromptOptions>({});

  const openAuthPrompt = useCallback((next: AuthPromptOptions = {}) => {
    setOptions(next);
    setOpen(true);
  }, []);

  const closeAuthPrompt = useCallback(() => {
    setOpen(false);
    setOptions({});
  }, []);

  const value = useMemo(
    () => ({ open, openAuthPrompt, closeAuthPrompt }),
    [open, openAuthPrompt, closeAuthPrompt]
  );

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={open}
        onClose={closeAuthPrompt}
        redirectPath={options.redirectPath}
        redirectState={options.redirectState}
        onAuthSuccess={options.onSuccess}
      />
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt() {
  const ctx = useContext(AuthPromptContext);
  if (!ctx) {
    throw new Error("useAuthPrompt must be used within AuthPromptProvider");
  }
  return ctx;
}

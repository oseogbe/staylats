import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CreateListingPromptContextValue = {
  open: boolean;
  openPrompt: () => void;
  closePrompt: () => void;
};

const CreateListingPromptContext =
  createContext<CreateListingPromptContextValue | null>(null);

export function CreateListingPromptProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPrompt = useCallback(() => setOpen(true), []);
  const closePrompt = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openPrompt, closePrompt }),
    [open, openPrompt, closePrompt],
  );

  return (
    <CreateListingPromptContext.Provider value={value}>
      {children}
    </CreateListingPromptContext.Provider>
  );
}

export function useCreateListingPrompt() {
  const ctx = useContext(CreateListingPromptContext);
  if (!ctx) {
    throw new Error("useCreateListingPrompt must be used within CreateListingPromptProvider");
  }
  return ctx;
}

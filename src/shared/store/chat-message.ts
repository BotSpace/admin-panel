import { create } from "zustand";

// State types
interface States {
  status: "info" | "warning" | "error" | "success" | "simple";
  text_content: string;
  files: File[];
}

// Actions types
interface Actions {
  setFiles(files: File[]): void;
  changeTextContent(text_content: string): void;
  changeStatus(status: States["status"]): void;
}

// useWorkStore
export const useChatMessageStore = create<States & Actions>((set) => ({
  text_content: "",
  files: [],
  status: "info",
  setFiles: (files: File[]) => set({ files }),
  changeStatus: (status: States["status"]) => set({ status }),
  changeTextContent: (text_content: string) => set({ text_content }),
}));

import { create } from "zustand";

export interface InlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

// State types
interface States {
  status: "info" | "warning" | "error" | "success" | "simple";
  text_content: string;
  files: File[];
  inlineButtons: InlineButton[][]; // Array of rows, each row is an array of buttons
}

// Actions types
interface Actions {
  setFiles(files: File[]): void;
  changeTextContent(text_content: string): void;
  changeStatus(status: States["status"]): void;
  setInlineButtons(buttons: InlineButton[][]): void;
  addInlineButtonRow(): void;
  addInlineButtonToRow(rowIndex: number, button: InlineButton): void;
  removeInlineButton(rowIndex: number, buttonIndex: number): void;
  removeInlineButtonRow(rowIndex: number): void;
  updateInlineButton(
    rowIndex: number,
    buttonIndex: number,
    button: Partial<InlineButton>
  ): void;
}

// useWorkStore
export const useChatMessageStore = create<States & Actions>((set) => ({
  text_content: "",
  files: [],
  status: "info",
  inlineButtons: [],
  setFiles: (files: File[]) => set({ files }),
  changeStatus: (status: States["status"]) => set({ status }),
  changeTextContent: (text_content: string) => set({ text_content }),
  setInlineButtons: (inlineButtons: InlineButton[][]) => set({ inlineButtons }),
  addInlineButtonRow: () =>
    set((state) => ({
      inlineButtons: [...state.inlineButtons, []],
    })),
  addInlineButtonToRow: (rowIndex: number, button: InlineButton) =>
    set((state) => {
      const newButtons = [...state.inlineButtons];
      if (!newButtons[rowIndex]) {
        newButtons[rowIndex] = [];
      }
      newButtons[rowIndex] = [...newButtons[rowIndex], button];
      return { inlineButtons: newButtons };
    }),
  removeInlineButton: (rowIndex: number, buttonIndex: number) =>
    set((state) => {
      const newButtons = [...state.inlineButtons];
      if (newButtons[rowIndex]) {
        newButtons[rowIndex] = newButtons[rowIndex].filter(
          (_, i) => i !== buttonIndex
        );
        // Remove empty rows
        if (newButtons[rowIndex].length === 0) {
          newButtons.splice(rowIndex, 1);
        }
      }
      return { inlineButtons: newButtons };
    }),
  removeInlineButtonRow: (rowIndex: number) =>
    set((state) => {
      const newButtons = [...state.inlineButtons].filter(
        (_, i) => i !== rowIndex
      );
      return { inlineButtons: newButtons };
    }),
  updateInlineButton: (
    rowIndex: number,
    buttonIndex: number,
    button: Partial<InlineButton>
  ) =>
    set((state) => {
      const newButtons = [...state.inlineButtons];
      if (newButtons[rowIndex] && newButtons[rowIndex][buttonIndex]) {
        newButtons[rowIndex] = newButtons[rowIndex].map((b, i) => {
          if (i === buttonIndex) {
            const updated = { ...b, ...button };
            // Ensure only one of callback_data or url exists
            if (updated.url) {
              delete updated.callback_data;
            } else if (updated.callback_data) {
              delete updated.url;
            }
            // Remove undefined values
            if (updated.url === undefined) delete updated.url;
            if (updated.callback_data === undefined)
              delete updated.callback_data;
            return updated;
          }
          return b;
        });
      }
      return { inlineButtons: newButtons };
    }),
}));

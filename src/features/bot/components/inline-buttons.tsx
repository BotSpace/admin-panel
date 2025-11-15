"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  useChatMessageStore,
  type InlineButton,
} from "@/shared/store/chat-message";

export default function InlineButtons() {
  const {
    inlineButtons,
    addInlineButtonRow,
    addInlineButtonToRow,
    removeInlineButton,
    removeInlineButtonRow,
    updateInlineButton,
  } = useChatMessageStore();

  const [editingButton, setEditingButton] = useState<{
    rowIndex: number;
    buttonIndex: number;
  } | null>(null);
  const [newButtonText, setNewButtonText] = useState("");
  const [newButtonType, setNewButtonType] = useState<"callback" | "url">(
    "callback"
  );
  const [newButtonCallback, setNewButtonCallback] = useState("");
  const [newButtonUrl, setNewButtonUrl] = useState("");

  const handleAddRow = () => {
    addInlineButtonRow();
  };

  const handleAddButton = (rowIndex: number) => {
    if (!newButtonText.trim()) {
      return;
    }

    if (newButtonType === "callback" && !newButtonCallback.trim()) {
      return;
    }

    if (newButtonType === "url" && !newButtonUrl.trim()) {
      return;
    }

    const button: InlineButton = {
      text: newButtonText.trim(),
      ...(newButtonType === "callback"
        ? { callback_data: newButtonCallback.trim() }
        : { url: newButtonUrl.trim() }),
    };

    addInlineButtonToRow(rowIndex, button);
    setNewButtonText("");
    setNewButtonType("callback");
    setNewButtonCallback("");
    setNewButtonUrl("");
  };

  const handleEditButton = (
    rowIndex: number,
    buttonIndex: number,
    button: InlineButton
  ) => {
    setEditingButton({ rowIndex, buttonIndex });
    setNewButtonText(button.text);
    if (button.url) {
      setNewButtonType("url");
      setNewButtonUrl(button.url);
      setNewButtonCallback("");
    } else {
      setNewButtonType("callback");
      setNewButtonCallback(button.callback_data || "");
      setNewButtonUrl("");
    }
  };

  const handleSaveEdit = () => {
    if (!editingButton || !newButtonText.trim()) {
      return;
    }

    if (newButtonType === "callback" && !newButtonCallback.trim()) {
      return;
    }

    if (newButtonType === "url" && !newButtonUrl.trim()) {
      return;
    }

    updateInlineButton(editingButton.rowIndex, editingButton.buttonIndex, {
      text: newButtonText.trim(),
      ...(newButtonType === "callback"
        ? { callback_data: newButtonCallback.trim(), url: undefined }
        : { url: newButtonUrl.trim(), callback_data: "" }),
    });

    setEditingButton(null);
    setNewButtonText("");
    setNewButtonType("callback");
    setNewButtonCallback("");
    setNewButtonUrl("");
  };

  const handleCancelEdit = () => {
    setEditingButton(null);
    setNewButtonText("");
    setNewButtonType("callback");
    setNewButtonCallback("");
    setNewButtonUrl("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Inline Buttonlar</Label>
          <p className="text-sm text-muted-foreground">
            Telegram inline keyboard buttonlarini yarating
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRow}
        >
          <Plus className="h-4 w-4 mr-2" />
          Qator qo'shish
        </Button>
      </div>

      {inlineButtons.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Hali buttonlar qo'shilmagan. Qator qo'shish tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inlineButtons.map((row, rowIndex) => (
            <div key={rowIndex} className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Qator {rowIndex + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInlineButtonRow(rowIndex)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                {row.map((button, buttonIndex) => (
                  <div
                    key={buttonIndex}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {button.text}
                        </span>
                        {button.url && (
                          <span className="text-xs text-muted-foreground">
                            (URL)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {button.url
                          ? `URL: ${button.url}`
                          : `callback: ${button.callback_data || ""}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleEditButton(rowIndex, buttonIndex, button)
                        }
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          removeInlineButton(rowIndex, buttonIndex)
                        }
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add button to row */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Button qo'shish
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yangi Button Qo'shish</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="button-text">Button matni *</Label>
                      <Input
                        id="button-text"
                        placeholder="Button matni"
                        value={newButtonText}
                        onChange={(e) => setNewButtonText(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Button turi *</Label>
                      <RadioGroup
                        value={newButtonType}
                        onValueChange={(value) => {
                          setNewButtonType(value as "callback" | "url");
                          setNewButtonCallback("");
                          setNewButtonUrl("");
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="callback" id="callback" />
                          <Label htmlFor="callback" className="cursor-pointer">
                            Callback Data
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="url" id="url" />
                          <Label htmlFor="url" className="cursor-pointer">
                            URL
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {newButtonType === "callback" ? (
                      <div className="space-y-2">
                        <Label htmlFor="button-callback">
                          Callback data * (masalan: btn_1, action_click)
                        </Label>
                        <Input
                          id="button-callback"
                          placeholder="callback_data"
                          value={newButtonCallback}
                          onChange={(e) => setNewButtonCallback(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Button bosilganda bu callback_data yuboriladi
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="button-url">URL *</Label>
                        <Input
                          id="button-url"
                          type="url"
                          placeholder="https://example.com"
                          value={newButtonUrl}
                          onChange={(e) => setNewButtonUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Button bosilganda bu URL ochiladi
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setNewButtonText("");
                          setNewButtonType("callback");
                          setNewButtonCallback("");
                          setNewButtonUrl("");
                        }}
                      >
                        Tozalash
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleAddButton(rowIndex)}
                        disabled={
                          !newButtonText.trim() ||
                          (newButtonType === "callback" &&
                            !newButtonCallback.trim()) ||
                          (newButtonType === "url" && !newButtonUrl.trim())
                        }
                      >
                        Qo'shish
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingButton && (
        <Dialog open={!!editingButton} onOpenChange={handleCancelEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buttonni Tahrirlash</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-button-text">Button matni *</Label>
                <Input
                  id="edit-button-text"
                  placeholder="Button matni"
                  value={newButtonText}
                  onChange={(e) => setNewButtonText(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Button turi *</Label>
                <RadioGroup
                  value={newButtonType}
                  onValueChange={(value) => {
                    setNewButtonType(value as "callback" | "url");
                    if (value === "callback") {
                      setNewButtonUrl("");
                    } else {
                      setNewButtonCallback("");
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="callback" id="edit-callback" />
                    <Label htmlFor="edit-callback" className="cursor-pointer">
                      Callback Data
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="edit-url" />
                    <Label htmlFor="edit-url" className="cursor-pointer">
                      URL
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {newButtonType === "callback" ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-button-callback">Callback data *</Label>
                  <Input
                    id="edit-button-callback"
                    placeholder="callback_data"
                    value={newButtonCallback}
                    onChange={(e) => setNewButtonCallback(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Button bosilganda bu callback_data yuboriladi
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="edit-button-url">URL *</Label>
                  <Input
                    id="edit-button-url"
                    type="url"
                    placeholder="https://example.com"
                    value={newButtonUrl}
                    onChange={(e) => setNewButtonUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Button bosilganda bu URL ochiladi
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={
                    !newButtonText.trim() ||
                    (newButtonType === "callback" &&
                      !newButtonCallback.trim()) ||
                    (newButtonType === "url" && !newButtonUrl.trim())
                  }
                >
                  Saqlash
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

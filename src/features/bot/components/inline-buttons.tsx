"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
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
    "url"
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

    if (newButtonType === "url") {
      const urlTrimmed = newButtonUrl.trim();
      if (!urlTrimmed) {
        return;
      }
      
      // Validate URL starts with https:// or http://
      if (!urlTrimmed.startsWith("https://") && !urlTrimmed.startsWith("http://")) {
        alert("URL https:// yoki http:// bilan boshlanishi kerak!\nMasalan: https://example.com");
        return;
      }
      
      // Basic URL validation
      try {
        new URL(urlTrimmed);
      } catch (e) {
        alert("Noto'g'ri URL format!\nTo'g'ri format: https://example.com");
        return;
      }
    }

    const button: InlineButton = {
      text: newButtonText.trim(),
      ...(newButtonType === "callback"
        ? { callback_data: newButtonCallback.trim() }
        : { url: newButtonUrl.trim() }),
    };

    addInlineButtonToRow(rowIndex, button);
    setNewButtonText("");
    setNewButtonType("url");
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

    if (newButtonType === "url") {
      const urlTrimmed = newButtonUrl.trim();
      if (!urlTrimmed) {
        return;
      }
      
      // Validate URL starts with https:// or http://
      if (!urlTrimmed.startsWith("https://") && !urlTrimmed.startsWith("http://")) {
        alert("URL https:// yoki http:// bilan boshlanishi kerak!\nMasalan: https://example.com");
        return;
      }
      
      // Basic URL validation
      try {
        new URL(urlTrimmed);
      } catch (e) {
        alert("Noto'g'ri URL format!\nTo'g'ri format: https://example.com");
        return;
      }
    }

    updateInlineButton(editingButton.rowIndex, editingButton.buttonIndex, {
      text: newButtonText.trim(),
      ...(newButtonType === "callback"
        ? { callback_data: newButtonCallback.trim(), url: undefined }
        : { url: newButtonUrl.trim(), callback_data: "" }),
    });

    setEditingButton(null);
    setNewButtonText("");
    setNewButtonType("url");
    setNewButtonCallback("");
    setNewButtonUrl("");
  };

  const handleCancelEdit = () => {
    setEditingButton(null);
    setNewButtonText("");
    setNewButtonType("url");
    setNewButtonCallback("");
    setNewButtonUrl("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Xabarga interaktiv tugmalar qo'shing
          </p>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleAddRow}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Qator qo'shish
        </Button>
      </div>

      {inlineButtons.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-10 text-center bg-muted/30">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">
            Hali tugmalar qo'shilmagan
          </p>
          <p className="text-xs text-muted-foreground">
            "Qator qo'shish" tugmasini bosing va inline tugmalar yarating
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inlineButtons.map((row, rowIndex) => (
            <div key={rowIndex} className="group rounded-xl border-2 p-4 space-y-3 bg-card hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="gap-1.5">
                  <span className="text-xs font-medium">Qator {rowIndex + 1}</span>
                  <span className="text-xs opacity-70">• {row.length} ta tugma</span>
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeInlineButtonRow(rowIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Buttons Grid */}
              <div className="grid gap-2">
                {row.map((button, buttonIndex) => (
                  <div
                    key={buttonIndex}
                    className="group/button flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/40 transition-all"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {button.text}
                        </span>
                        <Badge variant="outline" className="text-xs h-5 px-1.5">
                          {button.url ? "URL" : "Callback"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate font-mono">
                        {button.url
                          ? button.url
                          : button.callback_data || "callback_data"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/button:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() =>
                          handleEditButton(rowIndex, buttonIndex, button)
                        }
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          removeInlineButton(rowIndex, buttonIndex)
                        }
                      >
                        <X className="h-3.5 w-3.5" />
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
                    className="w-full gap-1.5 hover:bg-primary/5 hover:border-primary/40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tugma qo'shish
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Yangi tugma qo'shish</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="button-text">Tugma matni *</Label>
                      <Input
                        id="button-text"
                        placeholder="Tugmada ko'rinuvchi matn"
                        value={newButtonText}
                        onChange={(e) => setNewButtonText(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Tugma turi *</Label>
                      <RadioGroup
                        value={newButtonType}
                        onValueChange={(value) => {
                          setNewButtonType(value as "callback" | "url");
                          setNewButtonCallback("");
                          setNewButtonUrl("");
                        }}
                        className="grid grid-cols-2 gap-3"
                      >
                        <div>
                          <RadioGroupItem 
                            value="callback" 
                            id="callback" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="callback" 
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                          >
                            <span className="text-sm font-medium">Callback</span>
                            <span className="text-xs text-muted-foreground">Ma'lumot</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem 
                            value="url" 
                            id="url" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="url" 
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                          >
                            <span className="text-sm font-medium">URL</span>
                            <span className="text-xs text-muted-foreground">Havola</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {newButtonType === "callback" ? (
                      <div className="space-y-2">
                        <Label htmlFor="button-callback">
                          Callback ma'lumoti *
                        </Label>
                        <Input
                          id="button-callback"
                          placeholder="btn_action, menu_1, ..."
                          value={newButtonCallback}
                          onChange={(e) => setNewButtonCallback(e.target.value)}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tugma bosilganda bu ma'lumot yuboriladi
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="button-url">URL manzil *</Label>
                        <Input
                          id="button-url"
                          type="url"
                          placeholder="https://example.com"
                          value={newButtonUrl}
                          onChange={(e) => setNewButtonUrl(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          URL https:// yoki http:// bilan boshlanishi shart
                        </p>
                        {newButtonUrl && !newButtonUrl.startsWith("https://") && !newButtonUrl.startsWith("http://") && (
                          <p className="text-xs text-destructive font-medium">
                            ⚠️ URL https:// bilan boshlashi kerak
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setNewButtonText("");
                          setNewButtonType("url");
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
                    URL https:// yoki http:// bilan boshlanishi shart
                  </p>
                  {newButtonUrl && !newButtonUrl.startsWith("https://") && !newButtonUrl.startsWith("http://") && (
                    <p className="text-xs text-destructive font-medium">
                      ⚠️ URL https:// bilan boshlashi kerak
                    </p>
                  )}
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

import React from "react";

// Example Delete Modal using shadcn/ui components, Tailwind and lucide-react icons
// File: shadcn-delete-modal.tsx

import { Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

type DeleteModalProps = {
  /** Whether the dialog is controlled open */
  open?: boolean;
  /** Controlled change handler */
  onOpenChange?: (open: boolean) => void;
  /** Name shown in the confirmation sentence (e.g. file name, user name) */
  itemName?: string;
  /** Async confirm handler - should throw or return rejected promise on failure */
  onConfirm: () => Promise<void> | void;
  /** Optional custom title */
  title?: string;
  /** Optional custom description */
  description?: string;
  /** Text for confirm button */
  confirmText?: string;
  trigger?: React.ReactNode; // Element that triggers the modal
};

export default function DeleteModal({
  open,
  onOpenChange,
  itemName = "this item",
  onConfirm,
  title = "Delete item",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  trigger,
}: DeleteModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync controlled props (if parent controls open)
  React.useEffect(() => {
    if (typeof open === "boolean") setIsOpen(open);
  }, [open]);

  const handleOpenChange = (val: boolean) => {
    // Clear error on open
    if (val) setError(null);
    // If parent provided a handler, call it too
    onOpenChange?.(val);
    // Only update internal state when uncontrolled
    if (typeof open !== "boolean") setIsOpen(val);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.resolve(onConfirm());
      // close after success (if uncontrolled)
      if (typeof open !== "boolean") setIsOpen(false);
      onOpenChange?.(false);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Trigger can be anything, exposed here for convenience. */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span>{title}</span>
            </div>
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete <strong>{itemName}</strong>?{" "}
            {description}
            {error ? (
              <p className="mt-3 text-sm text-destructive">Error: {error}</p>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {confirmText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -------------------------
// Example usage (in a page/component):
// -------------------------
// import DeleteModal from './shadcn-delete-modal';
//
// export default function Example() {
//   const handleDelete = async () => {
//     // simulate network call
//     await new Promise((res) => setTimeout(res, 1200));
//     // throw new Error('Failed to delete'); // uncomment to test error state
//     // proceed after successful delete (e.g., refresh list, show toast...)
//   };
//
//   return (
//     <div className="p-4">
//       <DeleteModal itemName="Project Phoenix" onConfirm={handleDelete} />
//     </div>
//   );
// }

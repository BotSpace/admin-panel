"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { createWithdrawalRequest } from "@/shared/services/requests/template-withdrawal";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/shared/lib/format-currency";

const withdrawalSchema = z.object({
  amount: z
    .string()
    .min(1, "Miqdor kiritilishi shart")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Miqdor 0 dan katta bo'lishi kerak"),
  card_number: z
    .string()
    .min(13, "Karta raqami kamida 13 ta raqamdan iborat bo'lishi kerak")
    .max(19, "Karta raqami 19 ta raqamdan oshmasligi kerak")
    .refine((val) => {
      const cleaned = val.replace(/\s/g, "");
      return /^\d{13,19}$/.test(cleaned);
    }, "Karta raqami faqat raqamlardan iborat bo'lishi kerak"),
  card_owner: z
    .string()
    .min(3, "Karta egasining ismi kamida 3 ta belgidan iborat bo'lishi kerak")
    .max(255, "Karta egasining ismi 255 ta belgidan oshmasligi kerak"),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface CreateWithdrawalDialogProps {
  availableBalance: string;
  onSuccess: () => void;
}

export function CreateWithdrawalDialog({
  availableBalance,
  onSuccess,
}: CreateWithdrawalDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: "",
      card_number: "",
      card_owner: "",
    },
  });

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate amount against available balance
      const amount = parseFloat(data.amount);
      const balance = parseFloat(availableBalance);
      
      if (amount > balance) {
        toast.error("Balans yetarli emas", {
          description: `Sizning balansingiz: ${formatCurrency(balance)} UZS`,
        });
        return;
      }

      await createWithdrawalRequest({
        amount: data.amount,
        card_number: data.card_number.replace(/\s/g, ""),
        card_owner: data.card_owner,
      });

      toast.success("So'rov yuborildi", {
        description: "Pul yechish so'rovi muvaffaqiyatli yuborildi",
      });

      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Withdrawal request error:", error);
      
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          "So'rovni yuborishda xatolik yuz berdi";
      
      toast.error("Xatolik", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <DollarSign className="h-4 w-4" />
          Pul yechish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pul yechish so'rovi</DialogTitle>
          <DialogDescription>
            Shablon daromadingizdan pul yechish uchun ma'lumotlarni kiriting
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Mavjud balans</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(parseFloat(availableBalance))} UZS
              </p>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miqdor (UZS)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="50000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Yechmoqchi bo'lgan pulning miqdori
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="card_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Karta raqami</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="8600 1234 5678 9012"
                      {...field}
                      onChange={(e) => {
                        // Format card number with spaces
                        const value = e.target.value.replace(/\s/g, "");
                        const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    13-19 raqamli plastik karta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="card_owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Karta egasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="JOHN DOE"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase());
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Kartada yozilgan ism familiya
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Yuborilmoqda..." : "So'rov yuborish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

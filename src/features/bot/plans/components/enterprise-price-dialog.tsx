"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/shared/components/ui/form";
import {
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/shared/lib/format-currency";
import { Separator } from "@/shared/components/ui/separator";

const enterpriseFormSchema = z.object({
  company_name: z
    .string()
    .min(2, "Kompaniya nomi kamida 2 belgidan iborat bo'lishi kerak")
    .max(200, "Kompaniya nomi 200 belgidan oshmasligi kerak"),
  first_name: z
    .string()
    .min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak")
    .max(150, "Ism 150 belgidan oshmasligi kerak"),
  last_name: z
    .string()
    .min(2, "Familiya kamida 2 belgidan iborat bo'lishi kerak")
    .max(150, "Familiya 150 belgidan oshmasligi kerak"),
  email: z
    .string()
    .email("To'g'ri email manzil kiriting")
    .max(254, "Email 254 belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqami to'liq kiritilishi kerak")
    .regex(/^\+?[1-9]\d{1,14}$/, "To'g'ri telefon raqami kiriting"),
  position: z.string().optional(),
  expected_users: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "Faqat raqamlar kiritilishi kerak"
    ),
  monthly_price: z
    .string()
    .min(1, "Narx kiritilishi shart")
    .refine(
      (val) => /^\d+(\.\d+)?$/.test(val) && parseFloat(val) > 0,
      "To'g'ri narx kiriting (masalan: 1000000)"
    ),
  start_date: z.string().optional(),
  additional_requirements: z.string().max(1000, "1000 belgidan oshmasligi kerak").optional(),
});

type EnterpriseFormData = z.infer<typeof enterpriseFormSchema>;

type EnterprisePriceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: EnterpriseFormData & { price: number }) => void;
};

export function EnterprisePriceDialog({
  open,
  onOpenChange,
  onConfirm,
}: EnterprisePriceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseFormSchema),
    defaultValues: {
      company_name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      position: "",
      expected_users: "",
      monthly_price: "",
      start_date: "",
      additional_requirements: "",
    },
  });

  const monthlyPrice = form.watch("monthly_price");
  const formattedPrice = monthlyPrice
    ? formatCurrency(parseFloat(monthlyPrice) || 0)
    : "";

  const handleSubmit = async (data: EnterpriseFormData) => {
    setIsSubmitting(true);
    try {
      const price = parseFloat(data.monthly_price);
      onConfirm({
        ...data,
        price,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting enterprise form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Enterprise Tarif So'rovi
          </DialogTitle>
          <DialogDescription className="text-base">
            Enterprise tarif uchun ma'lumotlaringizni to'ldiring. Bizning
            mutaxassislarimiz siz bilan tez orada bog'lanadi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Kompaniya ma'lumotlari */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Kompaniya ma'lumotlari</span>
              </div>
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" />
                      Kompaniya nomi *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masalan: Acme Corporation"
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Aloqa ma'lumotlari */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-primary" />
                <span>Aloqa ma'lumotlari</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        Ism *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ismingizni kiriting"
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        Familiya *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Familiyangizni kiriting"
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        Telefon raqami *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+998901234567"
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5" />
                      Lavozim
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masalan: CEO, CTO, Project Manager"
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription>
                      Kompaniyadagi lavozimingiz (ixtiyoriy)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Tarif ma'lumotlari */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Tarif ma'lumotlari</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expected_users"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        Kutilayotgan foydalanuvchilar soni
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Masalan: 1000"
                          className="h-10"
                          min="1"
                        />
                      </FormControl>
                      <FormDescription>
                        Taxminiy foydalanuvchilar soni (ixtiyoriy)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Boshlanish sanasi
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription>
                        Xizmatni qachon boshlashni rejalashtiryapsiz? (ixtiyoriy)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="monthly_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5" />
                      Oylik narx (UZS) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Masalan: 1000000"
                        className="h-10"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    {formattedPrice && (
                      <FormDescription className="text-primary font-medium">
                        {formattedPrice} / oy
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Qo'shimcha ma'lumotlar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Qo'shimcha ma'lumotlar</span>
              </div>

              <FormField
                control={form.control}
                name="additional_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Maxsus talablar yoki izohlar
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Maxsus integratsiya talablari, sozlashlar yoki boshqa ehtiyojlaringizni yozing..."
                        rows={4}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Qo'shimcha ma'lumotlar yoki maxsus talablaringiz (ixtiyoriy)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  "So'rov yuborish"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

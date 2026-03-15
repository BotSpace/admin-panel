"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  passwordSchema,
  type PasswordFormData,
} from "@/features/auth/types/profile";
import { ChangePassword } from "@/shared/services/requests/auth";

export function PasswordSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: PasswordFormData) => {
    setIsLoading(true);
    const toastId = toast.loading("Parol yangilanmoqda...");

    try {
      const response = await ChangePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      });

      if (response.data.status) {
        form.reset();
        toast.success("Parol muvaffaqiyatli yangilandi!", { id: toastId });
      } else {
        toast.error(
          response.data.message || "Parol yangilashda xatolik yuz berdi",
          { id: toastId },
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        "Parol yangilashda xatolik yuz berdi";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Parolni O'zgartirish
        </CardTitle>
        <CardDescription>
          Hisobingiz xavfsizligi uchun parolni yangilang
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joriy parol</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showOldPassword ? "text" : "password"}
                        disabled={isLoading}
                        placeholder="Joriy parolingizni kiriting"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yangi parol</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        disabled={isLoading}
                        placeholder="Yangi parol kiriting"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Parol kamida 8 belgi, bitta katta harf, bitta kichik harf va
                    bitta raqam bo'lishi kerak
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yangi parolni tasdiqlang</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isLoading}
                        placeholder="Yangi parolni qayta kiriting"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Yangilanmoqda..." : "Parolni Yangilash"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

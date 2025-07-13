"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { botFormSchema } from "@/schema/botSchema"; // Sxema faylini import qilish
import { instanceAuth } from "@/services/instance";
import toast from "react-hot-toast";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function CreateBotModal({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Formani aniqlash.
  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: "",
      development_token: "",
    },
  });

  // 2. Submit uchun funksiya.
  function onSubmit(values: z.infer<typeof botFormSchema>) {
    let toastId = toast.loading("Yaratilmoqda...");

    instanceAuth
      .post("/project/bot/", {
        ...values,
      })
      .then(() => {
        setIsOpen(true);
        toast.success("Bot yaratildi!", {
          id: toastId,
        });
      })
      .catch((err) => {
        const { data } = err.response.data;
        toast.error(data.message, {
          id: toastId,
        });
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yangi bot yaratish</DialogTitle>
          <DialogDescription>
            Yangi bot yaratish uchun uning nomini va tokenini kiriting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Bot nomi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masalan, Mening Super Botim"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="development_token"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Token</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="BotFather'dan olingan token"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Saqlash</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

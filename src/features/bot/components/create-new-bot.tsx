"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { botFormSchema } from "@/features/bot/botSchema"; // Sxema faylini import qilish
import { instanceAuth } from "@/shared/services/instance";
import toast from "react-hot-toast";
import { useRouter } from "@/shared/i18n/routing";
import { APIDetailCreateResponse, APIListResponse } from "@/shared/types/http";
import { Project } from "@/shared/types/project";
import { useReactQueryAction } from "@/shared/services/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Plan } from "@/shared/types/plan";

type Props = {
  dialogOpenButton: React.ReactNode;
  refetch: () => void;
};

export function CreateBotModal({ dialogOpenButton, refetch }: Props) {
  const route = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const { data: plansResponse, isLoading: plansLoading } = useReactQueryAction<
    APIListResponse<Plan[]>
  >({
    url: "plans/",
  });

  const plans = plansResponse?.data?.results ?? [];

  const mostPopularPlanId =
    plans.find((plan) => plan.name === "pro")?.id ?? plans[0]?.id;

  // 1. Formani aniqlash.
  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: "",
      token: "",
      // plan_id formda card tanlanganda setValue orqali to'ldiriladi
    },
  });

  const selectedPlanId = form.watch("plan_id");

  const goNext = () => {
    if (step === 1) {
      // faqat name ni tekshiramiz
      form.trigger("name").then((valid) => {
        if (valid) setStep(2);
      });
      return;
    }

    if (step === 2) {
      form.trigger("token").then((valid) => {
        if (valid) setStep(3);
      });
      return;
    }
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  // 2. Submit uchun funksiya.
  function onSubmit(values: z.infer<typeof botFormSchema>) {
    let toastId = toast.loading("Yaratilmoqda...");

    instanceAuth
      .post<APIDetailCreateResponse<Project>>("/project/", {
        ...values,
      })
      .then(({ data }) => {
        route.push(`/bot/${data.data.id}/constructor`);
        refetch();
        toast.success("Bot yaratildi!", {
          id: toastId,
        });
      })
      .catch((err) => {
        const { data } = err.response.data;
        toast.error(data.message, {
          id: toastId,
        });
      })
      .finally(() => {
        form.reset();
        setIsOpen(false);
        setStep(1);
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{dialogOpenButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yangi bot yaratish</DialogTitle>
          <DialogDescription>
            Loyiha nomi, bot tokeni va sizga mos tarifni bosqichma-bosqich
            tanlang.
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="mb-4 flex items-center justify-between text-xs font-medium">
          <div className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <span
              className={
                step >= 1
                  ? "text-sm font-semibold"
                  : "text-sm text-muted-foreground"
              }
            >
              Loyiha nomi
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span
              className={
                step >= 2
                  ? "text-sm font-semibold"
                  : "text-sm text-muted-foreground"
              }
            >
              Bot tokeni
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                step >= 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
            <span
              className={
                step >= 3
                  ? "text-sm font-semibold"
                  : "text-sm text-muted-foreground"
              }
            >
              Tarif tanlash
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Step content with animation */}
            <div key={step} className="step-animate space-y-4">
              {/* STEP 1: Loyiha nomi */}
              {step === 1 && (
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Bot nomi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masalan, Mening Super Botim"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Bu nom faqat admin panelda ko‘rinadi, istalgan vaqtda
                          o‘zgartirishingiz mumkin.
                        </p>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 2: Bot tokeni */}
              {step === 2 && (
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Bot tokeni</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234567890:AA... kabi tokenni kiriting"
                            className="font-mono text-xs"
                            {...field}
                          />
                        </FormControl>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="font-medium">
                            Bot tokenini olish uchun qisqacha qo‘llanma:
                          </p>
                          <ol className="list-decimal space-y-1 pl-5">
                            <li>
                              Telegramda{" "}
                              <a
                                href="https://t.me/BotFather"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                BotFather
                              </a>
                              ni oching.
                            </li>
                            <li>
                              <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
                                /newbot
                              </code>{" "}
                              buyrug‘ini yuboring va ko‘rsatmalarga amal qiling.
                            </li>
                            <li>
                              Yakunda sizga yuborilgan uzun tokenni shu yerga
                              nusxa ko‘chirib joylashtiring.
                            </li>
                          </ol>
                        </div>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 3: Plan tanlash (card ko‘rinishida) */}
              {step === 3 && (
                <div className="space-y-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">
                        Tarif rejasini tanlang
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Istalgan vaqtda keyinroq ham tarifni o‘zgartirishingiz
                        mumkin.
                      </p>
                    </div>
                  </div>

                  {plansLoading && (
                    <p className="text-xs text-muted-foreground">
                      Tariflar yuklanmoqda...
                    </p>
                  )}

                  {!plansLoading && !plans.length && (
                    <p className="text-xs text-destructive">
                      Tariflar ro‘yxatini yuklashda muammo yuz berdi.
                    </p>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      const isPopular = plan.id === mostPopularPlanId;

                      return (
                        <Card
                          key={plan.id}
                          className={`relative cursor-pointer border transition-all hover:border-primary hover:shadow-md ${
                            isSelected
                              ? "border-primary ring-2 ring-primary/30"
                              : ""
                          }`}
                          onClick={() =>
                            form.setValue("plan_id", plan.id, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          <CardHeader className="space-y-1 pb-3">
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle className="text-base">
                                {plan.name_display}
                              </CardTitle>
                              {isPopular && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                                  Eng mashhur
                                </span>
                              )}
                            </div>
                            <CardDescription className="text-xs">
                              {plan.description ||
                                "Kichik va o‘rta loyihalar uchun qulay tarif."}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold">
                                {plan.price}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                / oy
                              </span>
                            </div>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                              {typeof plan.max_users === "number" && (
                                <li>
                                  👥 Maks. foydalanuvchilar:{" "}
                                  <span className="font-medium">
                                    {plan.max_users}
                                  </span>
                                </li>
                              )}
                              {plan.custom_domain && (
                                <li>🌐 Shaxsiy domen ulash imkoniyati</li>
                              )}
                              {plan.priority_support && (
                                <li>⚡ Ustuvor texnik yordam</li>
                              )}
                              {plan.powered_by_botmother === false && (
                                <li>🚫 Powered by BotMother yozuvisiz</li>
                              )}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  <FormMessage />
                </div>
              )}
            </div>

            <DialogFooter className="mt-2 flex flex-row items-center justify-between gap-2">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goBack}
                  >
                    Orqaga
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {step < 3 && (
                  <Button type="button" onClick={goNext}>
                    Keyingi
                  </Button>
                )}
                {step === 3 && (
                  <Button type="submit" disabled={!selectedPlanId}>
                    Botni yaratish
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

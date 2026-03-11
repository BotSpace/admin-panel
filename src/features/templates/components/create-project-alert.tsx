"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"; // Form komponentlari qo'shildi
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { instanceAuth } from "@/shared/services/instance";
import { useRouter } from "@/shared/i18n/routing";
import { useSearchParams } from "next/navigation";
import SelectPlan from "@/shared/components/common/select-plan";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { botFormSchema } from "@/features/bot/botSchema";
import z from "zod";
import { useReactQueryAction } from "@/shared/services/react-query/use-react-query-action";
import { APIDetailCreateResponse, APIListResponse } from "@/shared/types/http";
import { Plan } from "@/shared/types/plan";
import { Project } from "@/shared/types/project";

interface NewProjectDialogProps {
  id: number;
}

export function NewProjectFromTemplateDialog({ id }: NewProjectDialogProps) {
  const searchParams = useSearchParams();
  const route = useRouter();

  // Bosqichlar: 'project' (nom va token) -> 'payment' (tarif)
  const [currentStep, setCurrentStep] = useState<"project" | "payment">(
    "project"
  );
  const [open, setOpen] = useState(false);

  // Tariflar ro'yxatini olish
  const { data: plansResponse } = useReactQueryAction<APIListResponse<Plan[]>>({
    url: "plans/",
  });
  const plans = plansResponse?.data?.results ?? [];
  const mostPopularPlanId =
    plans.find((plan) => plan.is_top)?.id ?? plans[0]?.id;

  // 1. Formani initsializatsiya qilish
  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: "",
      token: "",
      // plan_id default qiymati yo'q bo'lsa undefined qoladi yoki birinchi rejani berasiz
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form watch is required for plan selection
  const selectedPlanId = form.watch("plan_id");

  // URL orqali modalni ochish logikasi
  useEffect(() => {
    const show = searchParams.get("show");
    const template_id = searchParams.get("template_id");
    if (template_id && show === "true" && id == +template_id) {
      setOpen(true);
    }
  }, [searchParams, id]);

  // Modal yopilganda formani tozalash
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setCurrentStep("project");
    }
  };

  // "Keyingi qadam" tugmasi bosilganda validatsiya
  const handleNextStep = async () => {
    // Faqat 'name' va 'token' maydonlarini tekshiramiz
    const isValid = await form.trigger(["name", "token"]);
    if (isValid) {
      setCurrentStep("payment");
    }
  };

  // Orqaga qaytish
  const handleBackStep = () => {
    setCurrentStep("project");
  };

  // 2. Submit uchun funksiya.
  function onSubmit(values: z.infer<typeof botFormSchema>) {
    const toastId = toast.loading("Yaratilmoqda...");

    // Agar token bo'sh bo'lsa, uni yubormaymiz
    const payload = {
      template: id,
      ...values,
      ...(values.token === "" ? { token: undefined } : {}),
    };

    instanceAuth
      .post<APIDetailCreateResponse<Project>>("/project/create-from-template/", payload)
      .then(({ data }) => {

        // TODO Buni yaxshilash kerak
        instanceAuth.post("/enviroment/", {
          key: "RELEASE_BOT_TOKEN",
          value: payload.token,
          project: data.data.id,
        });

        route.push(`/bot/${data.data.id}/constructor`);

        toast.success("Bot yaratildi!", {
          id: toastId,
        });
      })
      .catch((err) => {
        const { data } = err.response.data;

        toast.dismiss(toastId);

        // IF error is plan_id
        data?.plan_id.map((msg: string) => {
          toast.error(msg, {
            id: toastId,
          });
        });
      });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 w-full">
          <Plus className="w-4 h-4" />
          Yangi Loyiha
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[900px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Yangi Loyiha Yaratish
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Andoza asosida yangi bot yaratish uchun ma'lumotlarni to'ldiring.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Form boshlanishi */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 1-BOSQICH: Nomi va Token */}
            {currentStep === "project" && (
              <div className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loyiha nomi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masalan: Telegrambot Pro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Token</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="font-mono text-xs"
                          placeholder="123456789:ABCdefGHIjklmnoPQRstuvWXYZ"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-[10px] text-muted-foreground">
                        BotFather orqali olingan tokenni kiriting.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* 2-BOSQICH: Tarif tanlash */}
            {currentStep === "payment" && (
              <SelectPlan
                selectedPlanId={selectedPlanId}
                mostPopularPlanId={mostPopularPlanId}
                onSelectPlan={(plan: Plan) =>
                  form.setValue("plan_id", plan.id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            )}

            <AlertDialogFooter className="mt-4 flex flex-row justify-between gap-2 sm:justify-between">
              {/* Bekor qilish yoki Orqaga tugmasi */}
              {currentStep === "project" ? (
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackStep}
                >
                  Orqaga
                </Button>
              )}

              {/* Keyingi yoki Yaratish tugmasi */}
              {currentStep === "project" ? (
                <Button type="button" onClick={handleNextStep}>
                  Keyingi qadam
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !selectedPlanId}
                >
                  {form.formState.isSubmitting ? "Yaratilmoqda..." : "Yaratish"}
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

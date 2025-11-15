"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit, Save, User, Mail, Phone, X } from "lucide-react";

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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import {
  profileSchema,
  type ProfileFormData,
} from "@/features/auth/types/profile";
import { UpdateProfile } from "@/shared/services/requests/auth";
import { GetMe } from "@/shared/services/requests/auth";

export function ProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  } | null>(null);

  // Initialize form with session data
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  // Fetch user data on mount
  useEffect(() => {
    if (session?.user?.access) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.access]);

  // Update form when userData changes
  useEffect(() => {
    if (userData) {
      form.reset({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const fetchUserData = async () => {
    if (!session?.user?.access) return;

    try {
      const response = await GetMe({ access: session.user.access });
      if (response?.data) {
        setUserData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone: response.data.phone,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik");
    }
  };

  const onSubmit = async (values: ProfileFormData) => {
    if (!session?.user?.access) {
      toast.error("Siz tizimga kirmagansiz");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Profil yangilanmoqda...");

    try {
      const response = await UpdateProfile(values);

      if (response.data.status) {
        // Update local state
        setUserData({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
        });

        // Update session
        await updateSession({
          ...session,
          user: {
            ...session.user,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone,
          },
        });

        setIsEditing(false);
        toast.success("Profil muvaffaqiyatli yangilandi!", { id: toastId });
      } else {
        toast.error("Profil yangilashda xatolik yuz berdi", { id: toastId });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        "Profil yangilashda xatolik yuz berdi";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      form.reset({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
    setIsEditing(false);
  };

  const fullName = userData
    ? [userData.first_name, userData.last_name].filter(Boolean).join(" ")
    : [session?.user?.first_name, session?.user?.last_name]
        .filter(Boolean)
        .join(" ") || "Foydalanuvchi";

  const initials =
    fullName
      .trim()
      .split(" ")
      .map((s: string) => s[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "U";

  const displayEmail = userData?.email || session?.user?.email || "";
  const displayPhone = userData?.phone || session?.user?.phone || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">
          Shaxsiy ma'lumotlaringizni ko'ring va tahrirlang
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Ma'lumotlari
              </CardTitle>
              <CardDescription>
                Shaxsiy ma'lumotlaringizni tahrirlang
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Tahrirlash
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 pb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={session?.user?.avatar || "/placeholder.svg"}
                alt={fullName}
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{fullName}</h3>
              {displayEmail && (
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {displayEmail}
                </p>
              )}
              {displayPhone && (
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Phone className="h-3 w-3" />
                  {displayPhone}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ism</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isLoading}
                          placeholder="Ismingizni kiriting"
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
                      <FormLabel>Familiya</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isLoading}
                          placeholder="Familiyangizni kiriting"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={!isEditing || isLoading}
                        placeholder="email@example.com"
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
                    <FormLabel>Telefon raqami</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        disabled={!isEditing || isLoading}
                        placeholder="+998901234567"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saqlanmoqda..." : "Saqlash"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Bekor qilish
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

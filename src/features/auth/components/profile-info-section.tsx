"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Save, User, Mail, Phone, Calendar, Hash, Upload } from "lucide-react";

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
import { UpdateProfile, GetMe } from "@/shared/services/requests/auth";

export function ProfileInfoSection() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    username?: string;
    date_joined?: string;
    id?: number;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (session?.user?.access) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.access]);

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
          username: response.data.username,
          date_joined: response.data.date_joined,
          id: response.data.id,
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
        setUserData({
          ...userData!,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
        });

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Rasm hajmi 5MB dan oshmasligi kerak");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // TODO: Upload avatar to server
    }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Noma'lum";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profil Ma'lumotlari
        </CardTitle>
        <CardDescription>Shaxsiy ma'lumotlaringizni tahrirlang</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 pb-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  avatarPreview || session?.user?.avatar || "/placeholder.svg"
                }
                alt={fullName}
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">{fullName}</h3>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <div className="flex items-center gap-3 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-medium">
                {userData?.id || session?.user?.id || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Ro'yxatdan o'tgan sana</p>
              <p className="font-medium">{formatDate(userData?.date_joined)}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Ism
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
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
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Familiya
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
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
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isLoading}
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
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefon raqami (ixtiyoriy)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      disabled={isLoading}
                      placeholder="+998901234567"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import {
  updateTemplateSubmission,
  getTemplateSubmission,
  getCategories,
  getFeatures,
} from "@/shared/services/requests/template-submission";
import { TemplateSubmissionUpdateRequest } from "@/features/templates/types/submission";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

export default function EditTemplateSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as string;
  const id = parseInt(params?.id as string, 10);

  const [formData, setFormData] = useState<TemplateSubmissionUpdateRequest>({
    name: "",
    short_description: "",
    description: "",
    original_price: "",
    demo_url: "",
    categories: [],
    features: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Fetch existing submission data
  const { data: submissionData, isLoading: submissionLoading } = useQuery({
    queryKey: ["template-submission", id],
    queryFn: () => getTemplateSubmission(id),
    enabled: !isNaN(id),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // Fetch features
  const { data: featuresData } = useQuery({
    queryKey: ["features"],
    queryFn: () => getFeatures(),
  });

  const submission = submissionData?.data?.data;

  // Populate form data when submission is loaded
  useEffect(() => {
    if (submission) {
      queueMicrotask(() =>
        setFormData({
          name: submission.name,
          short_description: submission.short_description,
          description: submission.description,
          original_price: submission.original_price,
          demo_url: submission.demo_url || "",
          categories: submission.categories?.map((cat) => cat.id) || [],
          features: submission.features?.map((feat) => feat.id) || [],
        }),
      );
    }
  }, [submission]);

  const mutation = useMutation({
    mutationFn: (data: TemplateSubmissionUpdateRequest) =>
      updateTemplateSubmission(id, data),
    onSuccess: () => {
      toast.success("Shablon muvaffaqiyatli yangilandi!");
      router.push(`/${lang}/template-submissions/${id}`);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: TemplateSubmissionUpdateRequest = {
      ...formData,
      image: imageFile,
      video: videoFile,
    };

    mutation.mutate(submitData);
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...(prev.categories || []), categoryId],
    }));
  };

  const handleFeatureToggle = (featureId: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...(prev.features || []), featureId],
    }));
  };

  const categories = categoriesData?.data?.data?.results || [];
  const features = featuresData?.data?.data?.results || [];

  if (submissionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Shablon topilmadi</h2>
        <p className="text-muted-foreground mt-2">
          Siz qidirgan shablon mavjud emas yoki o'chirilgan.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/${lang}/template-submissions`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Link>
        </Button>
      </div>
    );
  }

  if (submission.status !== "pending") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Tahrirlash mumkin emas</h2>
        <p className="text-muted-foreground mt-2">
          Faqat "Ko'rib chiqilmoqda" holatidagi shablonlarni tahrirlash mumkin.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/${lang}/template-submissions/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${lang}/template-submissions/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shablonni tahrirlash
          </h1>
          <p className="text-muted-foreground">
            Shablon ma'lumotlarini yangilang
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shablon ma'lumotlari</CardTitle>
          <CardDescription>
            Kerakli ma'lumotlarni yangilang. (*) belgisi bilan belgilangan
            maydonlar majburiy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Shablon nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masalan: Online do'kon boti"
                required
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description">
                Qisqa tavsif <span className="text-red-500">*</span>
              </Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    short_description: e.target.value,
                  })
                }
                placeholder="Qisqa tavsif (1-2 jumla)"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Batafsil tavsif <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Shablon haqida batafsil ma'lumot. Qanday funksiyalar mavjud, nima uchun foydalanish mumkin va hokazo."
                rows={6}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="original_price">
                Narx (so'm) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="original_price"
                type="number"
                min="0"
                step="1000"
                value={formData.original_price}
                onChange={(e) =>
                  setFormData({ ...formData, original_price: e.target.value })
                }
                placeholder="150000"
                required
              />
              <p className="text-sm text-muted-foreground">
                Shablonning taklif qilingan narxi (so'mda)
              </p>
            </div>

            {/* Demo URL */}
            <div className="space-y-2">
              <Label htmlFor="demo_url">Demo URL</Label>
              <Input
                id="demo_url"
                type="url"
                value={formData.demo_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, demo_url: e.target.value })
                }
                placeholder="https://t.me/your_demo_bot"
              />
              <p className="text-sm text-muted-foreground">
                Telegram bot havolasi yoki demo sahifa
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Rasm</Label>
              {submission.image && !imageFile && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Hozirgi rasm:
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic submission image */}
                  <img
                    src={submission.image}
                    alt={submission.name}
                    className="rounded-lg max-w-xs h-auto border"
                  />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  Tanlangan: {imageFile.name}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Yangi rasm yuklang (maksimal: 10MB) yoki mavjudini saqlang
              </p>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label htmlFor="video">Video</Label>
              {submission.video && !videoFile && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Hozirgi video:
                  </p>
                  <video
                    src={submission.video}
                    controls
                    className="rounded-lg max-w-xs h-auto border"
                  />
                </div>
              )}
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              {videoFile && (
                <p className="text-sm text-muted-foreground">
                  Tanlangan: {videoFile.name}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Yangi video yuklang (maksimal: 100MB) yoki mavjudini saqlang
              </p>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label>Kategoriyalar</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-md border p-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={formData.categories?.includes(category.id)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.id)
                        }
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Shablonga mos keladigan kategoriyalarni tanlang
                </p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-2">
                <Label>Xususiyatlar</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-md border p-4">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={formData.features?.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <Label
                        htmlFor={`feature-${feature.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {feature.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Shablonda mavjud xususiyatlarni tanlang
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/${lang}/template-submissions/${id}`)
                }
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Yangilash
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

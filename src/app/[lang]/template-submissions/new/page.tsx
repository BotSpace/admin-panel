"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import {
  submitTemplate,
  getCategories,
  getFeatures,
} from "@/shared/services/requests/template-submission";
import { TemplateSubmissionRequest } from "@/features/templates/types/submission";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { BotType } from "@/shared/types/bot";
import { toast } from "sonner";
import Link from "next/link";

export default function NewTemplateSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as string;

  const [formData, setFormData] = useState<
    Omit<TemplateSubmissionRequest, "project"> & { project: number | null }
  >({
    project: null,
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

  // Fetch user's projects
  const { data: projectsData, isLoading: projectsLoading } =
    useReactQueryAction<APIListResponse<BotType[]>>({
      url: "project/",
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

  const mutation = useMutation({
    mutationFn: submitTemplate,
    onSuccess: () => {
      toast.success("Shablon muvaffaqiyatli yuborildi!");
      router.push(`/${lang}/template-submissions`);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.project || formData.project === 0) {
      toast.error("Iltimos, loyihani tanlang");
      return;
    }

    const submitData: TemplateSubmissionRequest = {
      ...formData,
      project: formData.project,
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

  const projects = projectsData?.data?.results || [];
  const categories = categoriesData?.data?.data?.results || [];
  const features = featuresData?.data?.data?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${lang}/template-submissions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shablon sifatida yuborish
          </h1>
          <p className="text-muted-foreground">
            Loyihangizni shablon sifatida yuborish uchun ma'lumotlarni
            to'ldiring
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shablon ma'lumotlari</CardTitle>
          <CardDescription>
            Barcha kerakli ma'lumotlarni to'ldiring. (*) belgisi bilan
            belgilangan maydonlar majburiy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">
                Loyiha <span className="text-red-500">*</span>
              </Label>
              {projectsLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loyihalar yuklanmoqda...
                  </span>
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Sizda hali loyiha yo'q. Avval loyiha yaratishingiz kerak.
                  </p>
                  <Button variant="link" className="mt-2 p-0" asChild>
                    <Link href={`/${lang}`}>Loyiha yaratish</Link>
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.project?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, project: parseInt(value) })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Loyihani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

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
                Shablon rasmini yuklang (maksimal: 10MB)
              </p>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label htmlFor="video">Video</Label>
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
                Demo video yuklang (maksimal: 100MB)
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
                onClick={() => router.push(`/${lang}/template-submissions`)}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={
                  mutation.isPending ||
                  projects.length === 0 ||
                  !formData.project
                }
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Yuborish
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

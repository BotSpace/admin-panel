"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Upload, Loader2, Send } from "lucide-react";
import {
  submitTemplate,
  getCategories,
  getFeatures,
} from "@/shared/services/requests/template-submission";
import { TemplateSubmissionRequest } from "@/features/templates/types/submission";
import toast from "react-hot-toast";

interface SubmitTemplateDialogProps {
  projectId: number;
  projectName: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function SubmitTemplateDialog({
  projectId,
  projectName,
  trigger,
  onSuccess,
}: SubmitTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TemplateSubmissionRequest>({
    project: projectId,
    name: "",
    short_description: "",
    description: "",
    original_price: "",
    categories: [],
    features: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: featuresData } = useQuery({
    queryKey: ["features"],
    queryFn: () => getFeatures(),
  });

  const mutation = useMutation({
    mutationFn: submitTemplate,
    onSuccess: () => {
      toast.success("Shablon muvaffaqiyatli yuborildi!");
      setOpen(false);
      resetForm();
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      project: projectId,
      name: "",
      short_description: "",
      description: "",
      original_price: "",
      categories: [],
      features: [],
    });
    setImageFile(null);
    setVideoFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: TemplateSubmissionRequest = {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Shablon sifatida yuborish
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shablon sifatida yuborish</DialogTitle>
          <DialogDescription>
            Loyihangiz: <strong>{projectName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="short_description">
              Qisqa tavsif <span className="text-red-500">*</span>
            </Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              placeholder="Qisqa tavsif"
              required
            />
          </div>

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
              placeholder="Shablon haqida batafsil ma'lumot"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="original_price">
              Narx (so'm) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="original_price"
              type="number"
              value={formData.original_price}
              onChange={(e) =>
                setFormData({ ...formData, original_price: e.target.value })
              }
              placeholder="150000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input
              id="demo_url"
              type="url"
              value={formData.demo_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, demo_url: e.target.value })
              }
              placeholder="https://t.me/your_bot"
            />
          </div>

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
          </div>

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
          </div>

          {categoriesData?.data?.data?.results &&
            categoriesData.data.data.results.length > 0 && (
              <div className="space-y-2">
                <Label>Kategoriyalar</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categoriesData.data.data.results.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
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
              </div>
            )}

          {featuresData?.data?.data?.results &&
            featuresData.data.data.results.length > 0 && (
              <div className="space-y-2">
                <Label>Xususiyatlar</Label>
                <div className="grid grid-cols-2 gap-2">
                  {featuresData.data.data.results.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
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
              </div>
            )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
                  Yuborish
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  getTemplateSubmission,
  deleteTemplateSubmission,
} from "@/shared/services/requests/template-submission";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          <Clock className="mr-1 h-3 w-3" />
          Ko'rib chiqilmoqda
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          <CheckCircle className="mr-1 h-3 w-3" />
          Tasdiqlangan
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="border-red-500 text-red-500">
          <XCircle className="mr-1 h-3 w-3" />
          Rad etilgan
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const lang = params?.lang as string;
  const id = parseInt(params?.id as string);

  const { data, isLoading } = useQuery({
    queryKey: ["template-submission", id],
    queryFn: () => getTemplateSubmission(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTemplateSubmission(id),
    onSuccess: () => {
      toast.success("Shablon muvaffaqiyatli o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["template-submissions"] });
      router.push(`/${lang}/template-submissions`);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });

  const submission = data?.data?.data;

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href={`/${lang}/template-submissions`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Link>
        </Button>

        {submission.status === "pending" && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/${lang}/template-submissions/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Tahrirlash
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  O'chirish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu shablonni o'chirishni xohlaysizmi? Bu amalni qaytarib
                    bo'lmaydi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    O'chirish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl">{submission.name}</CardTitle>
                <CardDescription>{submission.project_name}</CardDescription>
              </div>
              {getStatusBadge(submission.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Narx:</span>
                <span className="text-sm">
                  {submission.original_price} so'm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Yuborilgan sana:</span>
                <span className="text-sm">
                  {new Date(submission.created_at).toLocaleDateString("uz-UZ")}
                </span>
              </div>
            </div>

            {submission.demo_url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Demo URL:</span>
                <a
                  href={submission.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {submission.demo_url}
                </a>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Qisqa tavsif:</h3>
              <p className="text-sm text-muted-foreground">
                {submission.short_description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Batafsil tavsif:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {submission.description}
              </p>
            </div>

            {submission.categories && submission.categories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Kategoriyalar:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {submission.categories.map((cat) => (
                    <Badge key={cat.id} variant="secondary">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {submission.features && submission.features.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Xususiyatlar:</h3>
                <div className="space-y-2">
                  {submission.features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <span className="font-medium">{feature.name}</span>
                        {feature.value && (
                          <span className="text-muted-foreground">
                            : {feature.value}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submission.image && (
              <div>
                <h3 className="text-sm font-medium mb-2">Rasm:</h3>
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic submission image */}
                <img
                  src={submission.image}
                  alt={submission.name}
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            {submission.video && (
              <div>
                <h3 className="text-sm font-medium mb-2">Video:</h3>
                <video
                  src={submission.video}
                  controls
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            {submission.rejection_reason && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Rad etish sababi:
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {submission.rejection_reason}
                </p>
              </div>
            )}

            {submission.reviewed_at && (
              <div className="text-sm text-muted-foreground">
                Ko'rib chiqildi:{" "}
                {new Date(submission.reviewed_at).toLocaleDateString("uz-UZ")}
                {submission.reviewed_by_phone &&
                  ` - ${submission.reviewed_by_phone}`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

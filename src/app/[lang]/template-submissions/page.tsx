"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemplateSubmissions } from "@/shared/services/requests/template-submission";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TemplateSubmission } from "@/features/templates/types/submission";

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

function SubmissionCard({ submission }: { submission: TemplateSubmission }) {
  const params = useParams();
  const lang = params?.lang as string;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{submission.name}</CardTitle>
            <CardDescription>{submission.project_name}</CardDescription>
          </div>
          {getStatusBadge(submission.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {submission.short_description}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">{submission.original_price} so'm</span>
            <span className="text-muted-foreground">
              {new Date(submission.created_at).toLocaleDateString("uz-UZ")}
            </span>
          </div>
          {submission.categories && submission.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {submission.categories.map((cat) => (
                <Badge key={cat.id} variant="secondary" className="text-xs">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
          {submission.rejection_reason && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Rad etish sababi:
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {submission.rejection_reason}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${lang}/template-submissions/${submission.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ko'rish
          </Link>
        </Button>
        {submission.status === "pending" && (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${lang}/template-submissions/${submission.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Tahrirlash
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function SubmissionCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}

export default function TemplateSubmissionsPage() {
  const params = useParams();
  const lang = params?.lang as string;
  
  const { data, isLoading } = useQuery({
    queryKey: ["template-submissions"],
    queryFn: () => getTemplateSubmissions(),
  });

  const submissions = data?.data?.data?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Yuborilgan shablonlar
          </h1>
          <p className="text-muted-foreground">
            Tasdiqlash uchun yuborilgan loyihalar
          </p>
        </div>
        <Button asChild>
          <Link href={`/${lang}/template-submissions/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Shablon yuborish
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SubmissionCardSkeleton />
          <SubmissionCardSkeleton />
          <SubmissionCardSkeleton />
        </div>
      ) : submissions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="mb-2">Yuborilgan shablon yo'q</CardTitle>
            <CardDescription className="mb-4">
              Hali hech qanday loyihani shablon sifatida yuborilmagan.
            </CardDescription>
            <Button asChild>
              <Link href={`/${lang}/template-submissions/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Shablon yuborish
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  );
}

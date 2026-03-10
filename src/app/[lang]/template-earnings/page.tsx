"use client";

import { Balance } from "@/features/auth/types/get-me";
import { TemplateWithdrawalRequest } from "@/features/templates/types/withdrawal";
import { CreateWithdrawalDialog } from "@/features/templates/components/create-withdrawal-dialog";
import { WithdrawalList } from "@/features/templates/components/withdrawal-list";
import { useReactQueryAction } from "@/shared/services/react-query";
import { ApiRetrieveResponse, APIListResponse } from "@/shared/types/http";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCurrency } from "@/shared/lib/format-currency";
import { DollarSign, TrendingUp } from "lucide-react";
import PageHeader from "@/shared/components/common/page-header";

export default function WithdrawalPage() {
  const { data: balanceData, refetch: refetchBalance } = useReactQueryAction<
    ApiRetrieveResponse<Balance>
  >({
    url: "/user/balance",
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });

  const { data: withdrawalsData, refetch: refetchWithdrawals } = useReactQueryAction<
    APIListResponse<TemplateWithdrawalRequest[]>
  >({
    url: "/template/withdrawal",
  });

  const handleSuccess = () => {
    refetchBalance();
    refetchWithdrawals();
  };

  const templateBalance = balanceData?.data.template_balance || "0";
  const templateBalanceNum = parseFloat(templateBalance);

  return (
    <div className="py-2 space-y-8">
      {/* Header with Balance */}


      <PageHeader
        title="Shablon Daromadlari"
        description="Shablonlaringizdan olingan daromadlarni boshqaring va pul yeching"
        button={balanceData && (
          <CreateWithdrawalDialog
            availableBalance={templateBalance}
            onSuccess={handleSuccess}
          />
        )}

      />

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Shablon Balansi
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {balanceData ? (
              <>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(templateBalanceNum)} UZS
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Yechish uchun mavjud balans
                </p>
              </>
            ) : (
              <Skeleton className="h-8 w-32" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jami So'rovlar
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {withdrawalsData ? (
              <>
                <div className="text-2xl font-bold">
                  {withdrawalsData.data.total_items || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Barcha pul yechish so'rovlari
                </p>
              </>
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Qanday ishlaydi?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>1. Shablon sotilganda:</strong> Har bir sotuvdan 80% sizning shablon balansingizga qo'shiladi, 20% platforma komissiyasi.
          </p>
          <p>
            <strong>2. Pul yechish so'rovi:</strong> Balansda pul bo'lsa, yuqoridagi tugma orqali pul yechish so'rovini yuborishingiz mumkin.
          </p>
          <p>
            <strong>3. Tasdiqlash:</strong> Administrator so'rovingizni ko'rib chiqadi va tasdiqlasa, pul karta raqamingizga o'tkaziladi.
          </p>
        </CardContent>
      </Card>

      {/* Withdrawals List */}
      <Card>
        <CardHeader>
          <CardTitle>Pul Yechish So'rovlari</CardTitle>
          <CardDescription>
            Barcha pul yechish so'rovlaringiz ro'yxati
          </CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawalsData ? (
            <WithdrawalList
              withdrawals={withdrawalsData.data.results}
              onDelete={handleSuccess}
            />
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

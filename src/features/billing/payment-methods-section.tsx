"use client";

import { CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentMethodsSection() {
  const paymentMethods = [
    {
      id: "click",
      name: "Click",
      description: "Mobil to'lovlar",
      icon: Smartphone,
      color: "from-blue-500 to-blue-600",
      badge: "Tez",
    },
    {
      id: "payme",
      name: "Payme",
      description: "Raqamli hamyon",
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
      badge: "Mashhur",
    },
    {
      id: "uzum",
      name: "Uzum Pay",
      description: "Uzum hamyoni",
      icon: Building2,
      color: "from-orange-500 to-orange-600",
      badge: "Yangi",
    },
    {
      id: "card",
      name: "Bank Kartasi",
      description: "UZCARD, HUMO",
      icon: CreditCard,
      color: "from-emerald-500 to-emerald-600",
      badge: "Xavfsiz",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2">
          Qulay to'lov usullari
        </h3>
        <p className="text-sm text-muted-foreground">
          Balansni to'ldirish uchun istalgan usulni tanlang
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 p-4"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Badge */}
              <div className="absolute top-3 right-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {method.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${method.color} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {method.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {method.description}
                </p>

                {/* Hidden button revealed on hover */}
                <div className="w-full pt-2 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-lg text-xs font-medium border-primary/20 hover:border-primary hover:bg-primary/5 mt-2"
                  >
                    Tanlash
                  </Button>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info message */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">💡 Maslahat:</span>{" "}
          Barcha to'lov usullari xavfsiz va shifrlangan. Komissiya yo'q!
        </p>
      </div>
    </div>
  );
}

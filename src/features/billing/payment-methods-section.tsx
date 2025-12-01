"use client";

import { Button } from "@/shared/components/ui/button";
import Image from "next/image";

import Click from "../../../public/click.svg";
import Payme from "../../../public/payme.png";
import Paynet from "../../../public/paynet.svg";
import Uzum from "../../../public/uzum.svg";

export function PaymentMethodsSection() {
  const paymentMethods = [
    {
      id: "click",
      name: "Click",
      description: "Mobil to'lovlar",
      icon: Click,
      color: "from-blue-500/50 to-blue-600",
    },
    {
      id: "payme",
      name: "Payme",
      description: "Raqamli hamyon",
      icon: Payme,
      color: "from-cyan-500/50 to-cyan-600",
    },
    {
      id: "uzum",
      name: "Uzum Bank",
      description: "Uzum hamyoni",
      icon: Uzum,
      color: "from-violet-500/20 to-violet-600/70",
    },
    {
      id: "card",
      name: "Bank Kartasi",
      description: "UZCARD, HUMO",
      icon: Paynet,
      color: "from-emerald-500/50 to-emerald-600",
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
          return (
            <div
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
                  Tez kunda
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${method.color} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Image
                    className="w-full h-[200px] object-contain"
                    src={method.icon}
                    alt={method.name}
                  />
                </div>

                <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {method.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {method.description}
                </p>

                {/* Hidden button revealed on hover */}
                <div className="w-full pt-2 border-t border-border/50 transition-opacity duration-300 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-lg text-xs font-medium border-primary/20 hover:border-primary hover:bg-primary/5 mt-2"
                  >
                    Tanlash
                  </Button>
                </div>
              </div>
            </div>
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

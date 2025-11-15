"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFundsModal({ isOpen, onClose }: AddFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("click");

  if (!isOpen) return null;

  const paymentMethods = [
    { id: "click", name: "Click", icon: "💳" },
    { id: "payme", name: "Payme", icon: "📱" },
    { id: "uzum", name: "Uzum Pay", icon: "🏪" },
    { id: "card", name: "Bank Card (UZCARD)", icon: "🏦" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-lg max-w-md w-full border border-border">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Mablag' qo'shish
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Summa (UZS)
            </label>
            <input
              type="number"
              placeholder="Summani kiriting"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              To'lov usuli
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <p className="text-xs font-medium text-foreground">
                    {method.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border border-border rounded-lg font-medium"
            >
              Bekor qilish
            </Button>
            <Button className="flex-1 bg-primary hover:bg-accent text-primary-foreground rounded-lg font-medium">
              Balansni to'ldirish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

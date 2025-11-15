import { CreditCard, Bell } from "lucide-react";

export function BillingSettings() {
  return (
    <div className="space-y-6">
      {/* Saved Cards */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Saqlangan kartalar
        </h3>

        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground">
              UZCARD ••••••7842
            </p>
            <p className="text-xs text-muted-foreground mt-1">Muddati 12/26</p>
          </div>
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground">
              HUMO ••••••3156
            </p>
            <p className="text-xs text-muted-foreground mt-1">Muddati 08/25</p>
          </div>
          <button className="w-full py-2 px-3 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors border border-border">
            + Yangi karta qo'shish
          </button>
        </div>
      </div>

      {/* Auto-Topup Settings */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Avtomatik to'ldirish
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Balans qachon tushib ketsa
            </label>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                defaultValue="50000"
                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="flex items-center text-sm text-muted-foreground">
                UZS
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Avtomatik to'ldirish summa
            </label>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                defaultValue="500000"
                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="flex items-center text-sm text-muted-foreground">
                UZS
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Faol</span>
            <label className="relative cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-10 h-6 bg-muted peer-checked:bg-primary rounded-full peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Bildirishnomalar
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">
              Email ogohlantirish
            </label>
            <input
              type="checkbox"
              className="w-5 h-5 rounded accent-primary cursor-pointer"
              defaultChecked
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">
              Telegram ogohlantirish
            </label>
            <input
              type="checkbox"
              className="w-5 h-5 rounded accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">
              Kam balans haqida ogohlantirish
            </label>
            <input
              type="checkbox"
              className="w-5 h-5 rounded accent-primary cursor-pointer"
              defaultChecked
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Activity, HardDrive, Cpu } from "lucide-react";

export function UsageOverview() {
  const usageItems = [
    {
      icon: Activity,
      label: "Tarmoq (Network)",
      usage: 245.8,
      unit: "GB",
      color: "bg-chart-1/10 text-chart-1",
    },
    {
      icon: HardDrive,
      label: "Hotira (Disk)",
      usage: 18.4,
      unit: "GB",
      color: "bg-chart-2/10 text-chart-2",
    },
    {
      icon: Cpu,
      label: "CPU",
      usage: 3847,
      unit: "CPU-Hours",
      color: "bg-chart-3/10 text-chart-3",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
      {usageItems.map((item, idx) => {
        const Icon = item.icon;

        return (
          <div
            key={idx}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Bu oy uchun
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
            <p className="text-lg font-bold text-foreground">
              {item.usage} {item.unit}
            </p>
          </div>
        );
      })}
    </div>
  );
}

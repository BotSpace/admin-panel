export const TemplateCardSkeleton = () => {
  return (
    <div
      className="flex flex-col rounded-2xl border border-white/[0.07] overflow-hidden animate-pulse"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      {/* Preview */}
      <div
        className="aspect-video border-b border-white/[0.06]"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 w-3/4 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="h-5 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 rounded-md" style={{ background: "rgba(255,255,255,0.04)", width: `${70 - i * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 space-y-3 border-t border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-3 w-16 rounded-md" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
        <div className="flex gap-2">
          <div className="h-9 flex-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-9 flex-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
    </div>
  );
};

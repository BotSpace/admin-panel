"use client";

import { Rocket, ArrowRight } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import { buttonVariants } from "@/shared/components/ui/button";

function EmptyRelease() {
  const { id }: { id: string } = useParams();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Rocket className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold">Hali nashrlar yo'q</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        Botingizni ishga tushirish uchun avval konstruktorda loyiha tuzing,
        so'ng nashr qiling.
      </p>
      <Link
        href={`/bot/${id}/constructor`}
        className={buttonVariants({ className: "mt-6 gap-2" })}
      >
        Konstruktorga o'tish
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default EmptyRelease;

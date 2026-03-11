import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { buttonVariants } from "@/shared/components/ui/button";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";

function EmptyRelease() {
  const { id }: { id: string } = useParams();
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>No Releases</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          There are no releases yet. Click the button below to create your first
          release.
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/bot/${id}/constructor`} className={buttonVariants()}>
          Create Release 🎉
        </Link>
      </CardFooter>
    </Card>
  );
}

export default EmptyRelease;

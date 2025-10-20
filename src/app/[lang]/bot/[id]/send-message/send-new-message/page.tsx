import SendMessage from "@/features/bot/components/send-message";
import { Card, CardHeader } from "@/shared/components/ui/card";
import React from "react";

type Props = {};

function Page({}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <SendMessage />

      <Card>
        <CardHeader>salom</CardHeader>
      </Card>
    </div>
  );
}

export default Page;

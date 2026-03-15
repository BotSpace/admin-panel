// BotInfo component rewritten with shadcn/ui components

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { instance, instanceAuth } from "@/shared/services/instance";
import { Button } from "@/shared/components/ui/button";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

interface BotInfoProps {
  className?: string;
}

export default function BotInfo({ className }: BotInfoProps) {
  const { id }: { id: string } = useParams();

  const [botData, setBotData] = useState({
    id: 7979771827,
    is_bot: true,
    first_name: "sizning_bot",
    username: "bu_sizning_bot",
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false,
    can_connect_to_business: false,
    has_main_web_app: false,
  });

  const [token, setToken] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleSaveToken = async () => {
    setIsEditing(false);
    const toastId = toast.loading("Loading...");

    const { data: newBot } = await instance.get(
      `https://api.telegram.org/bot${token}/getMe`,
    );

    if (!newBot.ok) {
      toast.error("Bot tokeni xato", { id: toastId });
      return;
    }

    instanceAuth
      .patch(`/enviroment/RELEASE_BOT_TOKEN/?project=${id}`, { value: token })
      .then(() => {
        setBotData(newBot.result);
        toast.success("Bot tokeni yangilandi", { id: toastId });
      })
      .catch(() => toast.error("Xatolik yuz berdi", { id: toastId }));
  };

  return (
    <Card className={`shadow ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
            🤖
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
              {botData.first_name}
            </CardTitle>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">
              @{botData.username}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              ID: {botData.id}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 mt-4">
        {/* Token */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">Bot Token</label>
          <div className="flex gap-2">
            {isEditing ? (
              <Input
                type="text"
                placeholder="Paste your bot token here"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            ) : (
              <div className="flex-1 px-4 py-2 rounded-lg border font-mono text-sm truncate flex items-center">
                {"*".repeat(Math.max(8, token.length / 2))}
              </div>
            )}

            {!isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCopyToken}>
                  {tokenCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleSaveToken}>
                Save
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep your bot token secure and never share it publicly
          </p>
        </div>

        {/* Permissions */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Permissions
          </label>
          <div className="grid col-span-1 md:grid-cols-2 gap-3">
            <PermissionItem
              title="Join Groups"
              value={botData.can_join_groups}
            />
            <PermissionItem
              title="Read All Messages"
              value={botData.can_read_all_group_messages}
            />
            <PermissionItem
              title="Inline Queries"
              value={botData.supports_inline_queries}
            />
            <PermissionItem
              title="Business Connection"
              value={botData.can_connect_to_business}
            />
            <PermissionItem title="Web App" value={botData.has_main_web_app} />
            <PermissionItem title="Is Bot" value={botData.is_bot} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PermissionItem({ title, value }: { title: string; value: boolean }) {
  return (
    <Card className="p-3 flex flex-row items-center justify-between border rounded-lg">
      <span className="text-sm font-medium">{title}</span>
      <span
        className={`text-sm font-bold ${
          value ? "text-green-600" : "text-red-600"
        }`}
      >
        {value ? "✓" : "✗"}
      </span>
    </Card>
  );
}

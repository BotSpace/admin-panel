import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Folder, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { instanceAuth } from "@/shared/services/instance";
import { APIDetailCreateResponse } from "@/shared/types/http";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface AddNewCollectionInputProps {
  refetch: () => void;
}

export default function AddNewCollectionInput({ refetch }: AddNewCollectionInputProps) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const { data } = await instanceAuth.post("/collection/", {
        name,
        project: id,
      });
      router.push(`?collection=${data.data.id}`);
      refetch();
    } catch (error) {
      const axiosError = error as AxiosError<APIDetailCreateResponse<any>>;
      const errorMsg =
        axiosError.response?.data?.data?.non_field_errors?.[0] ||
        "Collection yaratishda xato yuz berdi";
      toast.error(errorMsg);
    } finally {
      setName("");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative px-3 py-2">
      <div className="flex items-center gap-2 truncate">
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground/60" />
        <input
          placeholder="Collection nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full bg-transparent outline-none"
          disabled={isLoading}
        />
      </div>

      {isLoading && (
        <Skeleton className="w-full h-full absolute top-0 left-0 pointer-events-none" />
      )}
    </div>
  );
}

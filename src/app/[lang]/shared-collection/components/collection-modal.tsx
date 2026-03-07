import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { instanceAuth } from "@/shared/services/instance";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { APIDetailCreateResponse } from "@/shared/types/http";

type Props = {
  refetch: () => void;
};

function CollectionModal({ refetch }: Props) {
  const router = useRouter();

  const { id }: { id: string } = useParams();

  const [name, setName] = useState("");

  const handleSubmit = () => {
    const toastId = toast.loading("Collection yaratilmoqda...");

    instanceAuth
      .post("/collection/", {
        name,
        project: id,
      })
      .then(({ data }) => {
        toast.success("Collection yaratildi", { id: toastId });
        router.push(`?collection=${data.data.id}`);
        refetch();
      })
      .catch((error: AxiosError<APIDetailCreateResponse<any>>) => {
        const errorMsg =
          error.response?.data?.data.non_field_errors[0] ||
          "Collection yaratishda xato yuz berdi";

        toast.error(errorMsg, { id: toastId });
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Plus />
          Collection Qo'shish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Collection nomini kiriting</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-4">
          <input
            type="text"
            placeholder="Collection nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border p-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction disabled={!name} onClick={handleSubmit}>
            Yuborish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CollectionModal;

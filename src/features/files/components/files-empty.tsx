import { File } from "lucide-react";
import React from "react";

type Props = {};

function FilesEmpty({}: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-12 text-center">
        <File className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Fayllar mavjud emas</h3>
        <p className="text-sm text-muted-foreground">
          Hozircha hech qanday fayl yo'q. Yangi fayl yuklang.
        </p>
      </div>
    </div>
  );
}

export default FilesEmpty;

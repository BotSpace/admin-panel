import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIDetailCreateResponse } from "@/shared/types/http";
import { useParams } from "next/navigation";

interface CollectionItemComboboxProps {
  collection_name: string;
  value?: string | number;
  onSelect?: (value: string | number) => void;
  project?: string;
}

export function CollectionItemCombobox({
  collection_name,
  value,
  onSelect,
  project: projectProp,
}: CollectionItemComboboxProps) {
  const { id: paramsId } = useParams();
  const project_id = projectProp ?? paramsId;

  const { data } = useReactQueryAction<APIDetailCreateResponse<any[]>>({
    url: `collection/${collection_name}/query/`,
    method: "POST",
    query: {
      action: "find",
      project: project_id,
      page: "1",
      size: 100,
    },
    data: {
      limit: 100,
      skip: 0,
    },
  });

  const [open, setOpen] = React.useState(false);

  const items = data?.data || [];

  const getLabel = (val: string | number) => {
    const item = items.find((i) => i.id === val || i._id === val || i.uuid === val);
    return item ? item.name || item.title || item.id || item._id : val;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? getLabel(value) : "Tanlang..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Qidirish..." className="h-9" />
          <CommandList>
            <CommandEmpty>Hech narsa topilmadi.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemValue = item.id || item._id || item.uuid;
                const itemLabel = item.name || item.title || String(itemValue);

                return (
                  <CommandItem
                    key={String(itemValue)}
                    value={itemLabel}
                    onSelect={() => {
                      onSelect?.(itemValue);
                      setOpen(false);
                    }}
                  >
                    {itemLabel}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === itemValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

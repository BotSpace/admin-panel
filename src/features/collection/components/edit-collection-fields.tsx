"use client";

import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"
import { cn } from "@/shared/lib";
import { useReactQueryAction } from "@/shared/services/react-query"
import { APIDetailCreateResponse, APIListResponse, CollectionDetail, CollectionListItem } from "@/shared/types"
import { CalendarIcon, CheckIcon, FileIcon, HashIcon, ImageIcon, LinkIcon, MusicIcon, PlayIcon, TextIcon, VideoIcon } from "lucide-react"
import { useState } from "react"

type CollectionField = CollectionDetail["fields"][number];

type Props = {
    children: React.ReactNode;
    collectionName: string;
    projectId: string;
}

export function EditCollectionFieldsTrigger({ children, collectionName, projectId }: Props) {
    const [selectedField, setSelectedField] = useState<CollectionField | null>(null);
    const [editedField, setEditedField] = useState<Partial<CollectionField>>({});

    const { data: collectionDetailResponse } = useReactQueryAction<
        APIDetailCreateResponse<CollectionDetail>
    >({
        url: `collection/${collectionName}/?project=${projectId}`,
        enabled: !!collectionName && !!projectId,
    });

    const { data: collectionsResponse } = useReactQueryAction<
        APIListResponse<CollectionListItem[]>
    >({
        url: `collection/?project=${projectId}`,
        enabled: !!projectId && selectedField?.type === "relation",
    });

    const handleSelectField = (field: CollectionField) => {
        setSelectedField(field);
        setEditedField({
            name: field.name,
            required: field.required,
            default: field.default,
            relation_collection: field.relation_collection,
        });
    };

    const handleFieldChange = <K extends keyof CollectionField>(key: K, value: CollectionField[K]) => {
        setEditedField((prev) => ({ ...prev, [key]: value }));
    };

    const handleUpdateField = async () => {
        if (!selectedField) return;
        // TODO: O'zingizning update code yozing
    };

    const fields = collectionDetailResponse?.data.fields ?? [];
    const collections = collectionsResponse?.data.results ?? [];

    return (
        <Dialog>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateField(); }}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="min-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Collection fieldlarini tahrirlash</DialogTitle>
                        <DialogDescription>
                            Field tanlang va xususiyatlarini o‘zgartiring.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                        <div className="col-span-4 flex flex-col gap-2 w-60">
                            {fields.map((field) => (
                                <button
                                    className={cn("w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg  bg-transparent hover:bg-zinc-800  cursor-pointer text-zinc-200 transition-colors duration-150", {
                                        "bg-zinc-900": selectedField?.id === field.id,
                                    })}
                                    onClick={() => handleSelectField(field)}
                                    key={field.id}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 p-2 flex items-center justify-center rounded-md bg-blue-500 text-white text-sm font-semibold">
                                            {fieldButtonIcon(field.type)}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {field.name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <Separator orientation="vertical" className="h-full" />
                        {/* <div className="flex-1">
                            {selectedField ? (
                                <FieldGroup className="space-y-4">
                                    <Field>
                                        <Label>Name</Label>
                                        <Input
                                            value={editedField.name ?? ""}
                                            onChange={(e) => handleFieldChange("name", e.target.value)}
                                            placeholder="Field nomi"
                                        />
                                    </Field>
                                    <Field>
                                        <Label>Type</Label>
                                        <Input
                                            value={selectedField.type}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </Field>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="required"
                                            checked={editedField.required ?? false}
                                            onCheckedChange={(checked) =>
                                                handleFieldChange("required", !!checked)
                                            }
                                        />
                                        <Label htmlFor="required" className="cursor-pointer">
                                            Required
                                        </Label>
                                    </div>
                                    {selectedField.type !== "relation" && (
                                        <Field>
                                            <Label>Default</Label>
                                            <Input
                                                value={
                                                    editedField.default != null
                                                        ? String(editedField.default)
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (selectedField.type === "number") {
                                                        handleFieldChange("default", val ? Number(val) : null);
                                                    } else if (selectedField.type === "bool") {
                                                        handleFieldChange("default", val === "true");
                                                    } else {
                                                        handleFieldChange("default", val || null);
                                                    }
                                                }}
                                                placeholder="Default qiymat"
                                                type={
                                                    selectedField.type === "number"
                                                        ? "number"
                                                        : selectedField.type === "datetime"
                                                            ? "datetime-local"
                                                            : "text"
                                                }
                                            />
                                        </Field>
                                    )}
                                    {selectedField.type === "relation" && (
                                        <Field>
                                            <Label>Relation collection</Label>
                                            <Select
                                                value={
                                                    editedField.relation_collection != null
                                                        ? String(editedField.relation_collection)
                                                        : ""
                                                }
                                                onValueChange={(val) =>
                                                    handleFieldChange(
                                                        "relation_collection",
                                                        val ? Number(val) : null
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Collection tanlang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {collections
                                                        .filter(
                                                            (c) =>
                                                                c.id !== collectionDetailResponse?.data.id
                                                        )
                                                        .map((col) => (
                                                            <SelectItem
                                                                key={col.id}
                                                                value={String(col.id)}
                                                            >
                                                                {col.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                </FieldGroup>
                            ) : (
                                <div className="flex items-center justify-center h-48 text-muted-foreground">
                                    Field tanlang
                                </div>
                            )}
                        </div> */}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={!selectedField}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function fieldButtonIcon(fieldType: CollectionDetail['fields'][number]['type']) {
    switch (fieldType) {
        case "text":
            return <TextIcon />;
        case "number":
            return <HashIcon />;
        case "bool":
            return <CheckIcon />;
        case "datetime":
            return <CalendarIcon />;
        case "file":
            return <FileIcon />;
        case "audio":
            return <MusicIcon />;
        case "video":
            return <PlayIcon />;
        case "photo":
            return <ImageIcon />;
        case "relation":
            return <LinkIcon />;
    }
}
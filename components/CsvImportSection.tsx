"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CsvImportSectionProps = {
  title: string;
  description: string;
  headers: string[];
  disabled?: boolean;
  onImport: (file: File) => Promise<void>;
};

const CsvImportSection = ({
  title,
  description,
  headers,
  disabled = false,
  onImport,
}: CsvImportSectionProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please choose a CSV file");
      return;
    }

    try {
      setIsImporting(true);
      await onImport(file);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-sky-200 bg-sky-50/60 p-4 space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs leading-5 text-slate-500">
          Headers: {headers.join(", ")}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleChange}
          disabled={disabled || isImporting}
        />
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isImporting}
        >
          {isImporting ? "Importing..." : "Import CSV"}
        </Button>
        <span className="text-xs text-slate-500">
          {isImporting
            ? "Processing rows..."
            : "One header row, then data rows"}
        </span>
      </div>
    </div>
  );
};

export default CsvImportSection;

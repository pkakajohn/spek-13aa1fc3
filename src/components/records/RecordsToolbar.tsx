
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface RecordsToolbarProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImportClick: () => void;
  onNewRecordClick: () => void;
}

export const RecordsToolbar = ({
  searchTerm,
  onSearchChange,
  onImportClick,
  onNewRecordClick,
}: RecordsToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Αναζήτηση..."
          value={searchTerm}
          onChange={onSearchChange}
          className="max-w-sm"
        />
        <Input
          type="file"
          accept=".xlsx,.xls"
          className="max-w-sm hidden"
          id="excel-upload"
        />
        <Button
          onClick={onImportClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Εισαγωγή Excel
        </Button>
      </div>
      <Button onClick={onNewRecordClick}>Νέα Εγγραφή</Button>
    </div>
  );
};


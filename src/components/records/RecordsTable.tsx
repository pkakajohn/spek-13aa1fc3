
import { Record, columnTitles } from "@/types/record";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";

interface RecordsTableProps {
  records: Record[];
  onSort: (key: keyof Record) => void;
  sortConfig: {
    key: keyof Record | null;
    direction: "asc" | "desc" | null;
  };
  onEdit: (record: Record) => void;
  onDelete: (index: number) => void;
}

export const RecordsTable = ({ records, onSort, sortConfig, onEdit, onDelete }: RecordsTableProps) => {
  const renderSortIcon = (key: keyof Record) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Object.keys(columnTitles).map((key) => (
            <TableHead 
              key={key}
              className="cursor-pointer"
              onClick={() => onSort(key as keyof Record)}
            >
              {columnTitles[key as keyof Record]} {renderSortIcon(key as keyof Record)}
            </TableHead>
          ))}
          <TableHead>Ενέργειες</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record, index) => (
          <TableRow key={index}>
            {Object.values(record).map((value, i) => (
              <TableCell key={i}>{value}</TableCell>
            ))}
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(record)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(index)}
                  size="sm"
                >
                  Διαγραφή
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


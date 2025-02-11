
import { Record } from "@/types/record";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { columnTitles } from "@/types/record";

interface RecordFormProps {
  record: Record;
  onSubmit: () => void;
  onChange: (key: keyof Record, value: string) => void;
  mode: "edit" | "create";
}

export const RecordForm = ({ record, onSubmit, onChange, mode }: RecordFormProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(record).map((key) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{columnTitles[key as keyof Record]}</Label>
            <Input
              id={key}
              value={record[key as keyof Record]}
              onChange={(e) => onChange(key as keyof Record, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onSubmit}>
          {mode === "edit" ? "Ενημέρωση" : "Προσθήκη"}
        </Button>
      </div>
    </>
  );
};


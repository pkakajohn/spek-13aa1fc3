
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Pencil, Upload } from "lucide-react";
import * as XLSX from 'xlsx';

interface Record {
  date: string;
  protocol: string;
  creation: string;
  action: string;
  suggestion: string;
  status: string;
  registration: string;
  office: string;
  spekStatus: string;
  certificate: string;
  preRegistrar: string;
  manual: string;
  notes: string;
}

const ITEMS_PER_PAGE = 10;

const columnTitles: { [key in keyof Record]: string } = {
  date: "Ημερομηνία",
  protocol: "Αριθμός Πρωτοκόλλου",
  creation: "Τρόπος Δημιουργίας",
  action: "Πράξη",
  suggestion: "Εισήγηση",
  status: "Κατάσταση",
  registration: "Καταχώριση",
  office: "Γραφείο",
  spekStatus: "Κατάσταση ΣΠΕΚ",
  certificate: "Πιστοποιητικό",
  preRegistrar: "Προϊστάμενος",
  manual: "Τόμος",
  notes: "Σημειώσεις"
};

const Index = () => {
  const [records, setRecords] = useState<Record[]>([
    {
      date: "20240605",
      protocol: "52657/2024",
      creation: "ΔΙΑ ΖΩΣΗΣ",
      action: "ΥΠΟΘΗΚΗ",
      suggestion: "Χωρίς Εισήγηση",
      status: "Εγκεκριμένη",
      registration: "Καταχωρισμένη",
      office: "ΕΔΡΑ ΘΕΣΣΑΛΟΝΙΚΗΣ",
      spekStatus: "Καταχωρισμένη",
      certificate: "ΧΙΟΝΗ",
      preRegistrar: "",
      manual: "134",
      notes: "ΕΓΓΡΑΦΗ ΥΠΟΘΗΚΗΣ ΣΥΜΦΩΝΑ ΜΕ ΤΟ ΑΡΘΡΟ 1262 ΤΟΥ ΑΣΤΙΚΟΥ ΚΩΔΙΚΑ",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Record | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Record>({
    date: "",
    protocol: "",
    creation: "",
    action: "",
    suggestion: "",
    status: "",
    registration: "",
    office: "",
    spekStatus: "",
    certificate: "",
    preRegistrar: "",
    manual: "",
    notes: "",
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key: keyof Record) => {
    let direction: "asc" | "desc" | null = "asc";
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") direction = "desc";
      else if (sortConfig.direction === "desc") direction = null;
    }

    setSortConfig({ key, direction });
  };

  const sortRecords = (records: Record[]) => {
    if (!sortConfig.key || !sortConfig.direction) return records;

    return [...records].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedRecords = sortRecords(filteredRecords);
  
  const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = sortedRecords.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleAddRecord = () => {
    setRecords([...records, newRecord]);
    setNewRecord({
      date: "",
      protocol: "",
      creation: "",
      action: "",
      suggestion: "",
      status: "",
      registration: "",
      office: "",
      spekStatus: "",
      certificate: "",
      preRegistrar: "",
      manual: "",
      notes: "",
    });
    setIsNewRecordDialogOpen(false);
    toast({
      title: "Επιτυχία",
      description: "Η εγγραφή προστέθηκε επιτυχώς",
    });
  };

  const handleUpdateRecord = () => {
    if (!editingRecord) return;
    
    const updatedRecords = records.map((record) =>
      record === editingRecord ? newRecord : record
    );
    
    setRecords(updatedRecords);
    setEditingRecord(null);
    setNewRecord({
      date: "",
      protocol: "",
      creation: "",
      action: "",
      suggestion: "",
      status: "",
      registration: "",
      office: "",
      spekStatus: "",
      certificate: "",
      preRegistrar: "",
      manual: "",
      notes: "",
    });
    
    toast({
      title: "Επιτυχία",
      description: "Η εγγραφή ενημερώθηκε επιτυχώς",
    });
  };

  const handleDeleteRecord = (index: number) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
    toast({
      title: "Επιτυχία",
      description: "Η εγγραφή διαγράφηκε επιτυχώς",
    });
  };

  const handleEditClick = (record: Record) => {
    setEditingRecord(record);
    setNewRecord(record);
  };

  const renderSortIcon = (key: keyof Record) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json<Record>(worksheet);

        const updatedRecords = [...records];
        excelData.forEach((importedRecord) => {
          const existingIndex = updatedRecords.findIndex(
            (record) => record.protocol === importedRecord.protocol
          );

          if (existingIndex !== -1) {
            updatedRecords[existingIndex] = importedRecord;
          } else {
            updatedRecords.push(importedRecord);
          }
        });

        setRecords(updatedRecords);
        toast({
          title: "Επιτυχία",
          description: `Εισαγωγή ${excelData.length} εγγραφών με επιτυχία`,
        });
      } catch (error) {
        toast({
          title: "Σφάλμα",
          description: "Υπήρξε πρόβλημα κατά την εισαγωγή του αρχείου",
          variant: "destructive",
        });
        console.error('Error importing Excel:', error);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Διαχείριση Εγγραφών</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Αναζήτηση..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="max-w-sm"
            id="excel-upload"
          />
          <Button
            onClick={() => document.getElementById('excel-upload')?.click()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Εισαγωγή Excel
          </Button>
        </div>
        
        <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button>Νέα Εγγραφή</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingRecord ? "Επεξεργασία Εγγραφής" : "Νέα Εγγραφή"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(newRecord).map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{columnTitles[key as keyof Record]}</Label>
                  <Input
                    id={key}
                    value={newRecord[key as keyof Record]}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={editingRecord ? handleUpdateRecord : handleAddRecord}>
                {editingRecord ? "Ενημέρωση" : "Προσθήκη"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(newRecord).map((key) => (
                <TableHead 
                  key={key}
                  className="cursor-pointer"
                  onClick={() => handleSort(key as keyof Record)}
                >
                  {columnTitles[key as keyof Record]} {renderSortIcon(key as keyof Record)}
                </TableHead>
              ))}
              <TableHead>Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record, index) => (
              <TableRow key={index}>
                {Object.values(record).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(record)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteRecord(index)}
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
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Προηγούμενη
          </Button>
          <span className="py-2">
            Σελίδα {currentPage} από {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Επόμενη
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;


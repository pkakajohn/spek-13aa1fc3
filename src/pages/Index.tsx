
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { Record } from "@/types/record";
import { RecordForm } from "@/components/records/RecordForm";
import { RecordsTable } from "@/components/records/RecordsTable";
import { RecordsToolbar } from "@/components/records/RecordsToolbar";

const ITEMS_PER_PAGE = 10;

const emptyRecord: Record = {
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
  const [newRecord, setNewRecord] = useState<Record>({ ...emptyRecord });

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
    setNewRecord({ ...emptyRecord });
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
    setNewRecord({ ...emptyRecord });
    
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
    setIsNewRecordDialogOpen(true);
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
      
      <RecordsToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onImportClick={() => document.getElementById('excel-upload')?.click()}
        onNewRecordClick={() => {
          setEditingRecord(null);
          setNewRecord({ ...emptyRecord });
          setIsNewRecordDialogOpen(true);
        }}
      />
      
      <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingRecord ? "Επεξεργασία Εγγραφής" : "Νέα Εγγραφή"}</DialogTitle>
          </DialogHeader>
          <RecordForm
            record={newRecord}
            onSubmit={editingRecord ? handleUpdateRecord : handleAddRecord}
            onChange={(key, value) => setNewRecord({ ...newRecord, [key]: value })}
            mode={editingRecord ? "edit" : "create"}
          />
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <RecordsTable
          records={paginatedRecords}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={handleEditClick}
          onDelete={handleDeleteRecord}
        />
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


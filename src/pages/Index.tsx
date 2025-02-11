
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
    // Add more initial records here
  ]);

  const [searchTerm, setSearchTerm] = useState("");
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
  };

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    toast({
      title: "Επιτυχία",
      description: "Η εγγραφή προστέθηκε επιτυχώς",
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Διαχείριση Εγγραφών</h1>
      
      <div className="mb-4">
        <Input
          placeholder="Αναζήτηση..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ημερομηνία</TableHead>
              <TableHead>Πρωτόκολλο</TableHead>
              <TableHead>Δημιουργία</TableHead>
              <TableHead>Πράξη</TableHead>
              <TableHead>Εισήγηση</TableHead>
              <TableHead>Κατάσταση</TableHead>
              <TableHead>Καταχώριση</TableHead>
              <TableHead>Γραφείο</TableHead>
              <TableHead>ΣΠΕΚ</TableHead>
              <TableHead>Πιστοποιητικό</TableHead>
              <TableHead>Προκαταχωριστής</TableHead>
              <TableHead>Εγχειρίδιο</TableHead>
              <TableHead>Σημειώσεις</TableHead>
              <TableHead>Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.protocol}</TableCell>
                <TableCell>{record.creation}</TableCell>
                <TableCell>{record.action}</TableCell>
                <TableCell>{record.suggestion}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.registration}</TableCell>
                <TableCell>{record.office}</TableCell>
                <TableCell>{record.spekStatus}</TableCell>
                <TableCell>{record.certificate}</TableCell>
                <TableCell>{record.preRegistrar}</TableCell>
                <TableCell>{record.manual}</TableCell>
                <TableCell>{record.notes}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteRecord(index)}
                    size="sm"
                  >
                    Διαγραφή
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Index;

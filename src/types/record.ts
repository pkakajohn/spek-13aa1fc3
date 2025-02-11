
export interface Record {
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

export const columnTitles: { [key in keyof Record]: string } = {
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


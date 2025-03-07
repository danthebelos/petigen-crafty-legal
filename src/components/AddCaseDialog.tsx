
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CaseForm } from './CaseForm';
import { CaseFormValues } from '@/types/case';

interface AddCaseDialogProps {
  onAddCase: (data: CaseFormValues) => void;
}

export const AddCaseDialog: React.FC<AddCaseDialogProps> = ({ onAddCase }) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: CaseFormValues) => {
    onAddCase(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Processo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Processo</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do processo abaixo. Os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <CaseForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

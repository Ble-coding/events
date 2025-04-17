// components/confirm-modal.tsx
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';

  interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  export default function ConfirmModal({
    open,
    title,
    message,
    onConfirm,
    onCancel,
  }: ConfirmModalProps) {
    return (
      <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground py-2">{message}</div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

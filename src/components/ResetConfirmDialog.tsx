import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
interface ResetConfirmDialogProps {
  trigger?: React.ReactNode;
  onConfirm: () => void;
}
export function ResetConfirmDialog({ trigger, onConfirm }: ResetConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all">
            <Trash2 className="w-3 h-3" />
            System Reset
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border-border text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Confirm System Wipe?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            This will permanently delete your current Operating Profile and reset all local configuration.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-muted border-border/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground border-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none shadow-destructive/40"
          >
            Wipe Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
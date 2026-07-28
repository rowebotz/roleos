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
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
            Reset profile
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border-border text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold tracking-tight text-foreground">
            Reset your profile?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            Everything you've entered will be cleared from this browser. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-muted border-border/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground border-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none"
          >
            Reset profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
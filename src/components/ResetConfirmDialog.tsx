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
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 rounded-md transition-all">
            <Trash2 className="w-3 h-3" />
            System Reset
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold tracking-tight text-white">
            Confirm System Wipe?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 text-sm">
            This will permanently delete your current Operating Profile and reset all local configuration. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white border-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-500 text-white border-none shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)]"
          >
            Wipe Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
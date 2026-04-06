import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, title, description, isDeleting }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90%] mx-auto !rounded-2xl p-6 border-0 shadow-xl overflow-hidden bg-white">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
          <DialogDescription className="text-gray-500 mt-2 text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-end gap-3 mt-6">
          <Button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold border-0 shadow-none px-6 rounded-lg transition-colors"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold px-6 rounded-lg shadow-none transition-colors"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

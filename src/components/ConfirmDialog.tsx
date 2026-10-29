import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Native <dialog>: focus trapping and Escape-to-close come from the browser. */
export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl backdrop:bg-black/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      <h2 id="confirm-title" className="text-lg font-semibold">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white outline-none hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { ProgressApi } from "../hooks/useProgress";
import { ConfirmDialog } from "./ConfirmDialog";
import { MoreIcon } from "./Icons";

interface MoreMenuProps {
  exportJson: ProgressApi["exportJson"];
  importJson: ProgressApi["importJson"];
  reset: ProgressApi["reset"];
}

const itemClass =
  "block w-full rounded-md px-3 py-2 text-left text-sm outline-none hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800";

/** Backup actions (export / import / reset) tucked behind a "⋯" button. */
export function MoreMenu({ exportJson, importJson, reset }: MoreMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `java-roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
    setToast("Progress exported.");
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ok = importJson(await file.text());
    setToast(ok ? `Imported progress from ${file.name}.` : `${file.name} is not a valid progress file.`);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="More actions"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="grid size-9 place-items-center rounded-lg text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <MoreIcon className="size-5" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button type="button" className={itemClass} onClick={handleExport}>
            Export progress (JSON)
          </button>
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              setOpen(false);
              fileInput.current?.click();
            }}
          >
            Import progress…
          </button>
          <hr className="my-1 border-slate-200 dark:border-slate-700" />
          <button
            type="button"
            className={`${itemClass} text-red-600 dark:text-red-400`}
            onClick={() => {
              setOpen(false);
              setConfirmReset(true);
            }}
          >
            Reset all progress…
          </button>
        </div>
      )}
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        className="hidden"
        aria-label="Import progress file"
      />
      <ConfirmDialog
        open={confirmReset}
        title="Reset all progress?"
        message="This clears every topic status and watched video. Export first if you want a backup."
        confirmLabel="Reset progress"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset();
          setConfirmReset(false);
          setToast("Progress reset.");
        }}
      />
      <div role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
        {toast && (
          <p className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}

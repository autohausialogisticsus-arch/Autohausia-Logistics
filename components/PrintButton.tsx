"use client";

import { PrinterIcon } from "@/components/icons";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:border-amber hover:bg-amber hover:text-ink"
    >
      <PrinterIcon className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
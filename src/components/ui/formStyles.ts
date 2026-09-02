import clsx from "clsx";

/* Structural classes; the colour variant is swapped in, never appended —
   border-neutral-300 and border-danger are the same property at the same
   specificity, so appending would let Tailwind's source order decide. */
const baseInput =
  "w-full flex flex-row items-center gap-2 bg-white p-3 pl-4 text-b1 text-neutral-900 outline-none border rounded-lg placeholder:text-neutral-400 transition-colors";
const inputIdle =
  "border-neutral-300 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-400/20";
const inputInvalid =
  "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/20";

export const inputBox = (invalid?: unknown) =>
  clsx(baseInput, invalid ? inputInvalid : inputIdle);

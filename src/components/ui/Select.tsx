"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon } from "./icons";
import { selectBox } from "./formStyles";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  "aria-labelledby"?: string;
};

export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder = "-- เลือก --",
  invalid,
  ...aria
}: SelectProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = (focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const pick = (index: number) => {
    onChange(options[index].value);
    close(true);
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openWith = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      close(true);
      return;
    }

    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") {
        event.preventDefault();
        openWith(Math.max(selectedIndex, 0));
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(activeIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : openWith(Math.max(selectedIndex, 0)))}
        className={clsx(
          selectBox(invalid),
          "flex items-center justify-between gap-2 text-left",
          !selected && "text-neutral-500",
        )}
        {...aria}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDownIcon
          size={16}
          className={clsx(
            "shrink-0 text-neutral-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-activedescendant={`${listId}-${activeIndex}`}
          className="absolute top-full right-0 left-0 z-30 mt-1 max-h-60 animate-[nexus-fade-slide_0.15s_ease] overflow-y-auto rounded-xl border border-neutral-300 bg-white p-1 shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-active={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => pick(index)}
                className={clsx(
                  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-body-2 transition-colors",
                  isSelected
                    ? "bg-green-50 font-semibold text-green-700"
                    : "text-neutral-900",
                  isActive && !isSelected && "bg-neutral-50",
                )}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {isSelected && (
                  <CheckIcon size={12} strokeWidth={3} className="shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-soft";

type Size = "xs" | "small" | "base" | "large" | "extraLarge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  pill?: boolean;
  block?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "base",
  pill = false,
  block = false,
  loading = false,
  iconOnly = false,
  disabled,
  type,
  className,
  ...props
}: ButtonProps) {
  const baseStyle = clsx(
    "inline-flex items-center justify-center gap-[8px] cursor-pointer select-none",
    "font-medium transition-all duration-200",
    "[&_svg]:size-[1.15em]",
    "focus-visible:outline-none focus-visible:ring-2",
    "disabled:opacity-50 disabled:pointer-events-none",
  );

  // padding + label size — text-* utilities come from the design system (globals.css)
  const sizeStyles: Record<Size, string> = {
    xs: "py-[3px] px-[8px] text-body-3",
    small: "py-[4px] px-[12px] text-body-2",
    base: "py-[8px] px-[16px] text-body-1",
    large: "py-[12px] px-[24px] text-body-1",
    extraLarge: "py-[16px] px-[32px] text-h5",
  };

  // equal padding for icon-only buttons (.btn-icon)
  const iconSizes: Record<Size, string> = {
    xs: "p-[5px]",
    small: "p-[6px]",
    base: "p-[10px]",
    large: "p-[12px]",
    extraLarge: "p-[16px]",
  };

  // hover / active = one shade darker (per design notes) — tokens only
  const variantStyles: Record<Variant, string> = {
    primary: clsx(
      "bg-green-400 text-white focus-visible:ring-green-400/40",
      "not-disabled:hover:bg-green-500",
      "not-disabled:active:bg-green-600",
    ),
    secondary: clsx(
      "bg-blue-50 text-blue-600 border border-blue-200 focus-visible:ring-blue-200/40",
      "not-disabled:hover:bg-blue-100",
      "not-disabled:active:bg-blue-200",
    ),
    outline: clsx(
      "bg-white text-neutral-700 border border-neutral-400 focus-visible:ring-neutral-400/40",
      "not-disabled:hover:bg-neutral-100",
      "not-disabled:active:bg-neutral-200",
    ),
    ghost: clsx(
      "text-green-500",
      "not-disabled:hover:bg-green-50",
      "not-disabled:hover:text-green-600",
      "not-disabled:active:bg-green-100",
    ),
    danger: clsx(
      "border border-danger text-danger bg-white focus-visible:ring-danger/40",
      "not-disabled:hover:bg-danger not-disabled:hover:text-white",
      "not-disabled:active:bg-danger-dark"
    ),
    "danger-soft": clsx(
      "bg-danger-light text-danger",
      "not-disabled:hover:bg-danger-light",
      "not-disabled:hover:text-danger-dark",
      "not-disabled:active:bg-danger/20",
    ),
  };

  return (
    <button
      type={type ?? "button"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(
        baseStyle,
        pill ? "rounded-full" : "rounded-lg",
        iconOnly ? iconSizes[size] : sizeStyles[size],
        variantStyles[variant],
        block && "w-full",
        loading && "relative",
        className,
      )}
      {...props}
    >
      {loading && (
        <svg
          className="absolute size-[1.2em] animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className={clsx("contents", loading && "opacity-0")}>
        {children}
      </span>
    </button>
  );
}

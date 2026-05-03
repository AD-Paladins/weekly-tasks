import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, charCount, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="text-sm text-zinc-400 font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          className={cn(
            "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        <div className="flex justify-between text-xs">
          {error && <p className="text-red-400">{error}</p>}
          {charCount && (
            <span className={cn("ml-auto", currentLength >= (maxLength || 0) * 0.9 && "text-amber-400")}>
              {currentLength}{maxLength ? `/${maxLength}` : ""}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
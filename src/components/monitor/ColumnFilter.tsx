import { useState, useRef, useEffect } from "react";
import { Filter, ArrowUp, ArrowDown } from "lucide-react";

interface ColumnFilterProps {
  label: string;
  type: "sort" | "dropdown" | "both";
  options?: string[];
  selectedOption?: string;
  sortDir?: "asc" | "desc" | null;
  onSort?: (dir: "asc" | "desc") => void;
  onFilter?: (value: string) => void;
}

const ColumnFilter = ({
  label,
  type,
  options = [],
  selectedOption,
  sortDir,
  onSort,
  onFilter,
}: ColumnFilterProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center gap-1 relative" ref={ref}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      {(type === "sort" || type === "both") && (
        <div className="flex flex-col -space-y-1">
          <button
            onClick={() => onSort?.("asc")}
            className={`p-0.5 rounded transition-colors ${sortDir === "asc" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => onSort?.("desc")}
            className={`p-0.5 rounded transition-colors ${sortDir === "desc" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {(type === "dropdown" || type === "both") && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className={`p-1 rounded transition-colors ${selectedOption && selectedOption !== "All" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
          {open && (
            <div className="absolute top-full left-0 mt-1 z-50 min-w-[180px] rounded-md border border-border bg-popover shadow-lg py-1 max-h-60 overflow-auto">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilter?.(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                    selectedOption === opt
                      ? "bg-primary/10 text-primary"
                      : "text-popover-foreground hover:bg-secondary"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ColumnFilter;

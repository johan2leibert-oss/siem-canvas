import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const Placeholder = () => {
  const location = useLocation();
  const name = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Page";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Construction className="w-10 h-10 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground capitalize">{name}</h2>
      <p className="text-muted-foreground text-sm mt-1">This module is coming soon.</p>
    </div>
  );
};

export default Placeholder;

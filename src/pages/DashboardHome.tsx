import { Shield } from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-4 rounded-2xl bg-primary/10 glow-primary mb-6">
        <Shield className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to SentinelSIEM</h1>
      <p className="text-muted-foreground max-w-md">
        Navigate to <span className="text-primary font-medium">Overview</span> to view your security dashboard, or explore other modules from the navigation bar.
      </p>
    </div>
  );
};

export default DashboardHome;

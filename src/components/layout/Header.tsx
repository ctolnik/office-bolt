import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnresolvedAlerts } from "@/hooks/useAlerts";

export function Header() {
  const { data: unresolvedAlerts } = useUnresolvedAlerts();
  const unresolvedCount = unresolvedAlerts?.length || 0;

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unresolvedCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unresolvedCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}

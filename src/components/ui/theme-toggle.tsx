
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={className}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
            ) : (
              <Moon className="h-5 w-5 rotate-0 scale-100 transition-all" />
            )}
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cambiar a modo {theme === "light" ? "oscuro" : "claro"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 max-w-[1364px]">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            RadarDev
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/submit">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Compartilhar Dados
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-8 w-8 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

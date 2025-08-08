import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PlusCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Logo from "./Logo";
import { cn } from "../lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-background/50 sticky top-0 z-50 transition-all duration-300 border-b ${
        hasScrolled ? "backdrop-blur-sm border-foreground/10 " : "border-transparent"
      }`}
    >
      <div className={cn("w-full px-4 py-4 max-w-[1274px] mx-auto")}>
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            <Logo height={hasScrolled ? 24 : 29} className="transition-all duration-300" />
          </Link>

          <nav className="flex items-center gap-4">
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
            <Link to="/submit">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Compartilhar Dados
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, PlusCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Logo from "./Logo";
import { cn } from "../lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "../components/ui/sheet";

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
        {/* Mobile (md:hidden): hamburger left, logo right */}
        <div className="flex items-center justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 p-4">
                <Link to="/submit">
                  <SheetClose asChild>
                    <Button className="w-full justify-start gap-2" variant="default">
                      <PlusCircle className="h-4 w-4" />
                      Compartilhar Dados
                    </Button>
                  </SheetClose>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  Alternar tema
                </Button>
              </div>
              <SheetFooter className="p-4" />
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-2xl font-bold text-foreground">
            <Logo height={hasScrolled ? 24 : 29} className="transition-all duration-300" />
          </Link>
        </div>

        {/* Desktop (md:flex): mantém navegação atual */}
        <div className="hidden md:flex items-center justify-between">
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

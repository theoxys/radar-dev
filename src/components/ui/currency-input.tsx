import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder, className, id, required }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Converte número em centavos para string formatada em dólar
  const formatToCurrency = (cents: number): string => {
    if (cents === 0) return "";
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(dollars);
  };

  // Converte string formatada para número em centavos
  const parseCurrencyToCents = (formatted: string): number => {
    // Remove tudo que não é dígito
    const digits = formatted.replace(/\D/g, "");
    return parseInt(digits || "0", 10);
  };

  // Sincroniza o valor inicial
  useEffect(() => {
    setDisplayValue(formatToCurrency(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove tudo que não é dígito
    const digits = inputValue.replace(/\D/g, "");

    // Limita a 8 dígitos (máximo $999,999.99)
    const limitedDigits = digits.slice(0, 8);

    const cents = parseInt(limitedDigits || "0", 10);
    const formatted = formatToCurrency(cents);

    setDisplayValue(formatted);
    onChange(cents);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite: backspace, delete, tab, escape, enter, home, end, left, right
    if ([8, 9, 27, 13, 46, 35, 36, 37, 39].includes(e.keyCode)) {
      return;
    }

    // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey) {
      return;
    }

    // Bloqueia tudo que não é dígito (0-9)
    if (e.keyCode < 48 || e.keyCode > 57) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, 8);
    const cents = parseInt(digits || "0", 10);
    const formatted = formatToCurrency(cents);

    setDisplayValue(formatted);
    onChange(cents);
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      className={cn(className)}
      required={required}
      inputMode="numeric"
    />
  );
}

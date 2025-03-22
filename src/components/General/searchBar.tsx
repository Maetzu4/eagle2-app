import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [filterValue, setFilterValue] = useState("");

  return (
    <Input
      placeholder="Buscar en todas las columnas..."
      value={filterValue}
      onChange={(event) => {
        setFilterValue(event.target.value);
        onSearch(event.target.value);
      }}
      className="max-w-sm"
    />
  );
}


import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CasaSearchProps {
  termoBusca: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CasaSearch: React.FC<CasaSearchProps> = ({ termoBusca, onSearchChange }) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar por endereço ou referência..."
          className="pl-8"
          value={termoBusca}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default CasaSearch;

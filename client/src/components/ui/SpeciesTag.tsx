import React from "react";

interface SpeciesTagProps {
  name: string;
  onClick?: () => void;
}

const SpeciesTag: React.FC<SpeciesTagProps> = ({ name, onClick }) => {
  return (
    <span 
      className="species-tag bg-white px-3 py-1 rounded-full text-xs text-[#0A4D68] border border-[#05BFDB] cursor-pointer"
      onClick={onClick}
    >
      {name}
    </span>
  );
};

export default SpeciesTag;

import React, { useState, useEffect, useRef } from "react";

export interface Option {
    label: string;
    value: string;
}

interface MultiselectProps {
    options: Option[];
    selectedOptions: string[];
    onSelectionChange: (values: string[]) => void;
    placeholder?: string;
}

const Multiselect: React.FC<MultiselectProps> = ({
    options = [],
    selectedOptions = [],
    onSelectionChange,
    placeholder = "Select options...",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

    const toggleOption = (value: string) => {
        let updated: string[];
        if (selectedOptions.includes(value)) {
            updated = selectedOptions.filter((v) => v !== value);
        } else {
            updated = [...selectedOptions, value];
        }
        onSelectionChange(updated);
    };

    const clearAll = () => {
        onSelectionChange([]);
    };

    const removeOption = (value: string) => {
        onSelectionChange(selectedOptions.filter((v) => v !== value));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-72 relative" ref={dropdownRef}>
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedOptions.map((value) => {
                        const label = options.find((o) => o.value === value)?.label || value;
                        return (
                            <span key={value} className="bg-blue-200 px-2 py-1 rounded flex items-center gap-1">
                                {label}
                                <button className="text-red-500 hover:text-red-700" onClick={() => removeOption(value)}>
                                    ✕
                                </button>
                            </span>
                        );
                    })}
                    <button className="text-sm text-red-500 hover:underline" onClick={clearAll}>
                        Clear all
                    </button>
                </div>
            )}

            <div
                className="border p-2 rounded cursor-pointer bg-white flex justify-between items-center"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="text-gray-500">{selectedOptions.length === 0 ? placeholder : "Select more..."}</span>
                <span>▾</span>
            </div>

            {isOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-2">
                        <input
                            type="text"
                            className="w-full border p-1 rounded"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <div
                                key={opt.value}
                                className={`p-2 cursor-pointer hover:bg-blue-100 ${
                                    selectedOptions.includes(opt.value) ? "bg-blue-50" : ""
                                }`}
                                onClick={() => toggleOption(opt.value)}
                            >
                                {opt.label}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500 text-sm">No options found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Multiselect;

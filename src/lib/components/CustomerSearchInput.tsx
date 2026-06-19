"use client"

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { useCustomers, Customer } from "../contexts/CustomersContext";

interface CustomerSearchInputProps {
  value: string;
  onChange: (customer: Customer) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export function CustomerSearchInput({
  value,
  onChange,
  className = "",
  style = {},
  placeholder = "جستجو در مشتریان...",
}: CustomerSearchInputProps) {
  const colors = useCurrentColors();
  const { searchCustomers } = useCustomers();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [inputValue, setInputValue] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // جستجو در مشتریان
  useEffect(() => {
    const trimmedValue = (inputValue || "").trim();
    
    if (trimmedValue.length > 0) {
      const results = searchCustomers(trimmedValue);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [inputValue, searchCustomers]);

  // بستن dropdown با کلیک خارج از آن
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCustomer = (customer: Customer) => {
    setInputValue(customer.name);
    onChange(customer);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue.trim().length > 0 && searchResults.length > 0) {
            setShowDropdown(true);
          }
        }}
        className={className}
        style={style}
        placeholder={placeholder}
      />

      {/* Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-xl z-50 max-h-64 overflow-y-auto"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="p-2">
            <p
              className="text-xs px-3 py-2"
              style={{ color: colors.textSecondary }}
            >
              مشتریان موجود
            </p>
            {searchResults.slice(0, 5).map((customer) => (
              <button
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-opacity-50 transition-colors text-right"
                style={{
                  color: colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <span style={{ color: colors.primary }}>
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{customer.name}</p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {customer.phone}
                  </p>
                </div>
                <Check className="w-4 h-4" style={{ color: colors.success }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

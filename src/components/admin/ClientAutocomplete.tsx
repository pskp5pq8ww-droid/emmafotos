"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { InvoiceClient } from "@/lib/db/invoice-types";
import styles from "./Admin.module.css";

type Props = {
  /** Current value of the client name field */
  value: string;
  /** Called whenever the text input changes */
  onChange: (value: string) => void;
  /** Called when a suggestion is selected — fills all client fields */
  onSelect: (client: InvoiceClient) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
};

export function ClientAutocomplete({
  value,
  onChange,
  onSelect,
  name = "clientName",
  id = "clientName",
  placeholder = "Full name or company",
  required,
}: Props) {
  const [suggestions, setSuggestions] = useState<InvoiceClient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/invoice-clients?q=${encodeURIComponent(q)}`,
          { credentials: "same-origin" },
        );
        if (res.ok) {
          const data = (await res.json()) as { clients: InvoiceClient[] };
          setSuggestions(data.clients);
          setShowDropdown(data.clients.length > 0);
          setActiveIdx(-1);
        }
      } catch {
        // Silently ignore network errors for autocomplete
      } finally {
        setLoading(false);
      }
    }, 220);
  }, []);

  useEffect(() => {
    fetchSuggestions(value);
  }, [value, fetchSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectClient(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  function selectClient(client: InvoiceClient) {
    onSelect(client);
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIdx(-1);
  }

  function formatLastUsed(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  return (
    <div ref={wrapperRef} className={styles.autocompleteWrapper}>
      <input
        id={id}
        name={name}
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
          else fetchSuggestions(value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        aria-autocomplete="list"
        aria-expanded={showDropdown}
      />

      {showDropdown && suggestions.length > 0 && (
        <ul
          className={styles.autocompleteDropdown}
          role="listbox"
        >
          {suggestions.map((client, i) => (
            <li
              key={client.id}
              className={`${styles.autocompleteItem} ${i === activeIdx ? styles.autocompleteItemActive : ""}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus on input
                selectClient(client);
              }}
            >
              <span className={styles.autocompleteItemName}>{client.name}</span>
              <span className={styles.autocompleteItemMeta}>
                {[
                  client.email,
                  client.phone,
                  client.lastUsedAt
                    ? `Last used ${formatLastUsed(client.lastUsedAt)}`
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Invisible loading hint — screen reader accessible */}
      {loading && (
        <span aria-live="polite" style={{ position: "absolute", opacity: 0 }}>
          Searching…
        </span>
      )}
    </div>
  );
}

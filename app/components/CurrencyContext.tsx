"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type CurrencyCode = "PKR" | "USD" | "GBP" | "AED" | "EUR";

type Currency = {
  code: CurrencyCode;
  symbol: string;
  flag: string;
  name: string;
  rate: number;
};

type CurrencyContextType = {
  currency: Currency;
  currencies: Currency[];
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (priceInPKR: number) => number;
  formatPrice: (priceInPKR: number) => string;
};

const currencies: Currency[] = [
  {
    code: "PKR",
    symbol: "PKR",
    flag: "🇵🇰",
    name: "Pakistani Rupee",
    rate: 1,
  },
  {
    code: "USD",
    symbol: "$",
    flag: "🇺🇸",
    name: "US Dollar",
    rate: 0.00357,
  },
  {
    code: "GBP",
    symbol: "£",
    flag: "🇬🇧",
    name: "British Pound",
    rate: 0.00263,
  },
  {
    code: "AED",
    symbol: "د.إ",
    flag: "🇦🇪",
    name: "UAE Dirham",
    rate: 0.0131,
  },
  {
    code: "EUR",
    symbol: "€",
    flag: "🇪🇺",
    name: "Euro",
    rate: 0.00304,
  },
];

const CurrencyContext =
  createContext<CurrencyContextType | undefined>(
    undefined
  );

export function CurrencyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedCurrency, setSelectedCurrency] =
    useState<CurrencyCode>("PKR");

  useEffect(() => {
    const savedCurrency =
      localStorage.getItem("ayraz-currency");

    if (
      savedCurrency &&
      currencies.some(
        (item) => item.code === savedCurrency
      )
    ) {
      setSelectedCurrency(
        savedCurrency as CurrencyCode
      );
    }
  }, []);

  function setCurrency(code: CurrencyCode) {
    setSelectedCurrency(code);
    localStorage.setItem("ayraz-currency", code);
  }

  const currency =
    currencies.find(
      (item) => item.code === selectedCurrency
    ) || currencies[0];

  function convertPrice(priceInPKR: number) {
    return Number(priceInPKR) * currency.rate;
  }

  function formatPrice(priceInPKR: number) {
    const converted = convertPrice(
      Number(priceInPKR)
    );

    if (currency.code === "PKR") {
      return `PKR ${Math.round(converted).toLocaleString()}`;
    }

    return `${currency.symbol}${converted.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies,
        setCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      "useCurrency must be used inside CurrencyProvider"
    );
  }

  return context;
}
"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { UserContext } from "./user";
import { BusyContext } from "./busy";

interface SymbolsContextType {
    symbols?: any[];
    page: number;
    setPage: (page: number) => void;
    fetchSymbols: () => Promise<any[]>;
};

export const SymbolsContext = createContext({} as SymbolsContextType);

export const SymbolsProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useContext(UserContext);
    const { busy, setBusy } = useContext(BusyContext);
    const [symbols, setSymbols] = useState<any[]>();
    const [page, setPage] = useState(1);

    const fetchSymbols = useCallback(async () => {
        if (!token) {
            return [];
        }
        if (busy) {
            return null;
        }
        setBusy(true);
        try {
            const res = await fetch(`http://localhost:3000/finance/symbols?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBusy(false);
            return data.symbols;
        } catch (e) {
            console.error(e);
            setBusy(false);
            return [];
        }
    }, [page, token]);

    useEffect(() => {
        fetchSymbols().then(setSymbols);
    }, [token, fetchSymbols]);

    return (
        <SymbolsContext.Provider value={{ fetchSymbols, symbols, page, setPage }}>
            {children}
        </SymbolsContext.Provider>
    )
};
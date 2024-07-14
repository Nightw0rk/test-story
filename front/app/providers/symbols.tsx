"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { UserContext } from "./user";

interface SymbolsContextType {
    symbols?: any[];
    page: number;
    setPage: (page: number) => void;
    fetchSymbols: () => Promise<any[]>;
    fetchSymbol: (symbol: string) => Promise<any>;
    fetchWatchlist: (symbol: string) => Promise<any[]>;
    addToWatch(symbol: string, price: number, direction: string): Promise<any>;
    removeFromWatch(id: string) : Promise<void>;    
};

export const SymbolsContext = createContext({} as SymbolsContextType);

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000"

export const SymbolsProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useContext(UserContext);
    const [symbols, setSymbols] = useState<any[]>();
    const [page, setPage] = useState(1);

    const removeFromWatch = async (id: string) => {
        console.log('removing from watchlist', id);
        if (!token) {
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/finance/watch/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status >= 400) {
                console.error('failed to remove from watchlist', res.status);
                return
            }
            const data = await res.json();
            return data;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const fetchWatchlist = async (symbol: string) => {
        console.log('fetching watchlist', symbol);
        if (!token) {
            return [];
        }
        try {
            const res = await fetch(`${BACKEND_URL}/finance/watch/${symbol}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            return data.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    const addToWatch = async (symbol: string, price: number, direction: string) => {
        console.log('adding to watchlist', symbol, price, direction);
        if (!token) {
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/finance/watch/${symbol}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ price, direction })
            });
            if (res.status >= 400) {
                console.error('failed to add to watchlist', res.status);
            }
            const data = await res.json();
            return data;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const fetchSymbol = async (symbol: string) => {
        console.log('fetching symbol', symbol);
        if (!token) {
            return null;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/finance/symbols/${symbol}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.status >= 400) {
                return null;
            }
            const data = await res.json();
            
            return data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    const fetchSymbols = useCallback(async () => {
        if (!token) {
            return [];
        }
        try {
            const res = await fetch(`${BACKEND_URL}/finance/symbols?page=${page}&limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            return data;
        } catch (e) {
            console.error(e);
            return [];
        }
    }, [page, token]);

    useEffect(() => {
        fetchSymbols().then(data=>{
            console.log(data);
            setSymbols(data.data)
    });
    }, [token, fetchSymbols]);

    return (
        <SymbolsContext.Provider value={{ fetchSymbols, symbols, page, setPage, fetchSymbol, fetchWatchlist, addToWatch, removeFromWatch }}>
            {children}
        </SymbolsContext.Provider>
    )
};
"use client"
import Notiflix from "notiflix";
import { createContext, useState, useEffect } from "react"

interface BusyContextType {
    busy: boolean;
    setBusy: (busy: boolean) => void;
};

export const BusyContext = createContext({} as BusyContextType);

export const BusyProvider = ({ children }: { children: React.ReactNode }) => {

    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (busy) {
            Notiflix.Loading.pulse();
        } else {
            Notiflix.Loading.remove();
        }
    }, [busy]);

    return (
        <BusyContext.Provider value={{ busy, setBusy }}>
            {children}
        </BusyContext.Provider>
    )
};
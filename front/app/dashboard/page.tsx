"use client"
import React, { useContext, useEffect, useState } from "react";

import { SymbolsContext } from "@/app/providers/symbols";
import { BusyContext } from "@/app/providers/busy";

export default function Dashboard() {
    const { symbols, setPage, page }  = useContext(SymbolsContext);
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                {symbols?.map((symbol) => (
                    <div key={symbol.symbol}>{symbol.symbol}</div>
                ))}
            </div>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
}
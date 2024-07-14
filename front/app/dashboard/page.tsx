"use client"
import React, { useContext, useEffect, useState } from "react";

import { SymbolsContext } from "@/app/providers/symbols";
import { BusyContext } from "@/app/providers/busy";
import Link from "next/link";

export default function Dashboard() {
    const { symbols, setPage, page } = useContext(SymbolsContext);
    return (
        <div className="flex flex-col gap-2">
            <h1>Dashboard</h1>
            <div className="grid grid-cols-4 gap-4">
                {symbols?.map((symbol) => (
                    <Link href={`/dashboard/${symbol.symbol}`} key={symbol.symbol}>
                        <div className="border rounded-2xl p-4 flex flex-col">
                            <h2 className="text-2xl">{symbol.symbol}</h2>
                            <span className="text-sm">
                                <p>{symbol.description}</p>
                                <p>{symbol.type}</p>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex justify-start items-start p-5">
            <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
}
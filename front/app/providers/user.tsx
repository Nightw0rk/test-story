"use client"
import { createContext, useState, useEffect, useContext } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { BusyContext } from "@/app/providers/busy";

interface UserContextType {
    user?: string;
    token?: string;
    setUser: (userId: string, Token: string, refreshToken: string) => void;
};

export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<string | undefined>();
    const [token, setToken] = useState<string | undefined>();
    const [refreshToken, setRefreshToken] = useState<string | null>();
    const [path, _] = useState(usePathname());
    const router = useRouter();

    const setSignToken = (userId: string, Token: string, refreshToken: string) => {
        window.localStorage.setItem("uid", userId);
        window.localStorage.setItem("token", Token);
        window.localStorage.setItem("refreshToken", refreshToken);
        setUser(userId)
        setToken(Token)
        setRefreshToken(refreshToken);
    }

    useEffect(() => {
        setUser(window.localStorage.getItem("uid") ?? undefined);
        setToken(window.localStorage.getItem("token") ?? undefined);
        setRefreshToken(window.localStorage.getItem("refreshToken"))

    }, [])

    return (
        <UserContext.Provider value={{ user, token, setUser: setSignToken }}>
            {children}
        </UserContext.Provider>
    )
};
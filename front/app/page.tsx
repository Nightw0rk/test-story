"use client"
import { useContext } from "react";
import { UserContext } from "@/app/providers/user";
import { BusyContext } from "@/app/providers/busy";
import { auth } from "@/app/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Notiflix from "notiflix";

export default function Home() {
  const userContext = useContext(UserContext);
  const { busy, setBusy } = useContext(BusyContext);
  const sign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setBusy(false)
      if (!user.user) {
        return
      }
      const u = user.user!;
      userContext.setUser(u.uid, await u.getIdToken(), u.refreshToken);
      Notiflix.Notify.success("Sign in successful");
    } catch (error) {
      setBusy(false)
      Notiflix.Notify.failure("Sign in is failed");
      console.error(error);
    }

  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="flex flex-col space-y-4 text-black" onSubmit={sign}>
        <h1 className="text-4xl font-bold">Sign in</h1>
        <input
          type="text"
          placeholder="Email"
          name="email"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="p-2 border border-gray-300 rounded"
        />
        <button disabled={busy} className="p-2 bg-blue-500 text-white rounded disabled:bg-black-40">Sign in</button>
      </form>
    </main>
  );
}

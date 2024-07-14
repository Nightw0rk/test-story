"use client"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { SymbolsContext } from "@/app/providers/symbols"
import Notiflix from "notiflix"
import Link from "next/link"

export default function SymbolDashBoard() {
    const { slug } = useParams()
    const { fetchSymbol, fetchWatchlist, addToWatch, removeFromWatch } = useContext(SymbolsContext)
    const [addWatch, setAddWatch] = useState(false)
    const [watches, setWatches] = useState<any[]>()
    const [symbol, setSymbol] = useState<any>()
    useEffect(() => {
        if (!slug) {
            return
        }
        if (typeof slug !== 'string') {
            return
        }
        fetchSymbol(slug)
            .then(data => {
                if (data === null) {
                    return
                }
                console.log(data.data)
                setSymbol(data.data)
            });
        fetchWatchlist(slug).then(data => {
            setWatches(data)
        });
    }, [slug, fetchSymbol, fetchWatchlist])

    const removeFromWatchlist = (id: string) => {
        removeFromWatch(id).then(() => {
            Notiflix.Notify.success("Removed from watchlist")
            setWatches(watches?.filter(watch => watch.sid !== id))
        })
    }

    const addWatchlist = (e: any) => {
        e.preventDefault()
        const price = e.currentTarget.price.value
        const direction = e.currentTarget.direction.value
        console.log(price, direction)
        if (!price || !direction) {
            Notiflix.Notify.failure("Please fill in all fields")
            return
        }
        setAddWatch(false)
        if (!slug) {
            return
        }
        if (typeof slug !== 'string') {
            return
        }
        addToWatch(slug, price, direction).then(() => {
            Notiflix.Notify.success("Added to watchlist")
            return fetchWatchlist(slug)
        }).then(data => {
            setWatches(data)
        })
    }


    return <div className="flex flex-col min-w-screen min-h-screen">
        <h1 className="text-4xl flex gap-2 items-center">
            <Link href="/dashboard" className="text-xl text-gray-500 ">Back</Link>
            Symbol Dashboard
        </h1>
        <h2 className="text-2xl">{slug}</h2>
        <p>{symbol?.description}</p>
        <div className="flex flex-1 h-full">
            <div className="flex-1 text-black">
                <iframe
                    src={`https://widget.finnhub.io/widgets/stocks/chart?symbol=${slug}&watermarkColor=%231db954&backgroundColor=%23222222&textColor=white`}
                    className="w-full h-full"
                />
            </div>
            <div className="w-80 flex flex-col">
                <h3 className="text-2xl text-center mb-2">Watchlist</h3>
                <div className="flex-1">
                    {watches?.map(watch => {
                        return <div key={watch._id} className="flex gap-2 border rounded-xl p-4">
                            <div className="flex flex-1">
                                <div className="flex flex-1 flex-col">
                                    <span>{watch.price}$</span>
                                    <span>{watch.direction}</span>
                                </div>
                                <div className="flex flex-col">
                                    <button className="p-2 bg-red-500 text-white rounded disabled:bg-black-40" onClick={_=>removeFromWatchlist(watch.sid)}>Remove</button>
                                </div>
                            </div>


                        </div>
                    })}
                </div>
                <div className={`bg-slate-400 ${addWatch ? "" : "hidden"}`}>
                    <form className="flex flex-col gap-2 text-black p-5" onSubmit={addWatchlist}>
                        <input type="number" name="price" placeholder="Price" />
                        <select name="direction">
                            <option value="below">Below</option>
                            <option value="above">Above</option>
                        </select>
                        <button className="p-2 bg-blue-500 text-white rounded disabled:bg-black-40">Add</button>
                        <button className="p-2 bg-red-500 text-white rounded disabled:bg-black-40" onClick={() => setAddWatch(false)}>Cancel</button>
                    </form>
                </div>
                <button
                    className={`p-2 m-4 bg-blue-500 text-white rounded disabled:bg-black-40 ${addWatch ? "hidden" : ""}`}
                    onClick={() => setAddWatch(true)}
                >
                    Add to watchlist</button>
            </div>
        </div>
    </div>
}
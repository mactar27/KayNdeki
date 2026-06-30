"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"

export interface CartItem {
  key: string
  name: string
  details?: string
  price: number
  qty: number
  image?: string
}

interface CartState {
  items: CartItem[]
}

type Action =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "remove"; key: string }
  | { type: "setQty"; key: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] }

const STORAGE_KEY = "kayndeki_cart_v1"

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items }
    case "add": {
      const existing = state.items.find((i) => i.key === action.item.key)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === action.item.key ? { ...i, qty: i.qty + (action.qty ?? 1) } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.item, qty: action.qty ?? 1 }] }
    }
    case "remove":
      return { items: state.items.filter((i) => i.key !== action.key) }
    case "setQty":
      return {
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      }
    case "clear":
      return { items: [] }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) })
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // ignore
    }
  }, [state.items])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const count = state.items.reduce((sum, i) => sum + i.qty, 0)
    return {
      items: state.items,
      count,
      subtotal,
      addItem: (item, qty) => dispatch({ type: "add", item, qty }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      clear: () => dispatch({ type: "clear" }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

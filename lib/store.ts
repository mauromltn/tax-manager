'use client'

import { useSyncExternalStore, useCallback } from 'react'
import type { Transaction } from './types'

const STORAGE_KEY = 'ledger.transactions.v1'

const EMPTY: Transaction[] = []

let cache: Transaction[] = []
let initialized = false
const listeners = new Set<() => void>()

function read(): Transaction[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Transaction[]) : []
  } catch {
    return []
  }
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  cache = read()
  initialized = true
  // Sync across tabs.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      cache = read()
      emit()
    }
  })
}

function write(next: Transaction[]) {
  cache = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  emit()
}

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  ensureInit()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Transaction[] {
  ensureInit()
  return cache
}

function getServerSnapshot(): Transaction[] {
  return EMPTY
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useTransactions() {
  const transactions = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addTransaction = useCallback((input: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tx: Transaction = { ...input, id: uid(), createdAt: Date.now() }
    write([tx, ...cache])
    return tx
  }, [])

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
      write(cache.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    },
    [],
  )

  const deleteTransaction = useCallback((id: string) => {
    write(cache.filter((t) => t.id !== id))
  }, [])

  const importTransactions = useCallback((rows: Transaction[]) => {
    write([...rows, ...cache])
  }, [])

  const clearAll = useCallback(() => {
    write([])
  }, [])

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importTransactions,
    clearAll,
  }
}

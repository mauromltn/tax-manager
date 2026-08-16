import type { Transaction } from './types'
import { categoryLabel, isDeductible } from './types'

export function formatCurrency(value: number, opts?: { sign?: boolean }): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  if (opts?.sign) {
    if (value > 0) return `+${formatted}`
    if (value < 0) return `-${formatted}`
  }
  return value < 0 ? `-${formatted}` : formatted
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function taxYearOf(iso: string): number {
  return Number(iso.slice(0, 4))
}

export function availableTaxYears(transactions: Transaction[]): number[] {
  const years = new Set<number>()
  for (const t of transactions) years.add(taxYearOf(t.date))
  years.add(new Date().getFullYear())
  return [...years].sort((a, b) => b - a)
}

export interface Totals {
  income: number
  expenses: number
  net: number
  deductible: number
  count: number
}

export function computeTotals(transactions: Transaction[]): Totals {
  let income = 0
  let expenses = 0
  let deductible = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else {
      expenses += t.amount
      if (isDeductible(t.category)) {
        // Meals are commonly 50% deductible; approximate that here.
        deductible += t.category === 'meals' ? t.amount * 0.5 : t.amount
      }
    }
  }
  return {
    income,
    expenses,
    net: income - expenses,
    deductible,
    count: transactions.length,
  }
}

export interface CategoryBreakdown {
  category: string
  label: string
  total: number
}

export function breakdownByCategory(
  transactions: Transaction[],
  type: Transaction['type'],
): CategoryBreakdown[] {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== type) continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, label: categoryLabel(category), total }))
    .sort((a, b) => b.total - a.total)
}

export interface MonthlyPoint {
  month: string // yyyy-mm
  label: string // "Jan"
  income: number
  expenses: number
}

export function monthlySeries(transactions: Transaction[], year: number): MonthlyPoint[] {
  const months: MonthlyPoint[] = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    return {
      month: `${year}-${m}`,
      label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, i, 1)),
      income: 0,
      expenses: 0,
    }
  })
  for (const t of transactions) {
    const idx = Number(t.date.slice(5, 7)) - 1
    if (taxYearOf(t.date) !== year || idx < 0 || idx > 11) continue
    if (t.type === 'income') months[idx].income += t.amount
    else months[idx].expenses += t.amount
  }
  return months
}

/* ---------- CSV ---------- */

function csvEscape(value: string | number): string {
  const s = String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function toCSV(transactions: Transaction[]): string {
  const header = ['Date', 'Type', 'Category', 'Description', 'Amount']
  const rows = transactions.map((t) => [
    t.date,
    t.type,
    categoryLabel(t.category),
    t.description,
    t.amount.toFixed(2),
  ])
  return [header, ...rows].map((r) => r.map(csvEscape).join(',')).join('\n')
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTransactions } from '@/lib/store'
import {
  availableTaxYears,
  breakdownByCategory,
  computeTotals,
  downloadCSV,
  monthlySeries,
  taxYearOf,
  toCSV,
} from '@/lib/finance'
import {
  ALL_CATEGORIES,
  type Transaction,
  type TransactionType,
} from '@/lib/types'
import type { TrendPoint } from './trend-chart'
import { Sidebar, type View } from './sidebar'
import { OverviewView } from './views/overview-view'
import { TransactionsView } from './views/transactions-view'
import { ReportsView } from './views/reports-view'
import { EmptyState } from './empty-state'
import { TransactionFormDialog } from './transaction-form-dialog'

const VIEW_META: Record<View, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Your financial picture at a glance' },
  transactions: { title: 'Transactions', subtitle: 'Every income and expense entry' },
  reports: { title: 'Reports', subtitle: 'Year-over-year summaries and export' },
}

export function LedgerApp() {
  const { transactions, deleteTransaction, importTransactions, clearAll } = useTransactions()

  const [view, setView] = React.useState<View>('overview')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Transaction | null>(null)

  const currentYear = new Date().getFullYear()
  const [year, setYear] = React.useState<number | 'all'>(currentYear)
  const [typeFilter, setTypeFilter] = React.useState<TransactionType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')

  const years = React.useMemo(() => availableTaxYears(transactions), [transactions])

  const yearScoped = React.useMemo(
    () => (year === 'all' ? transactions : transactions.filter((t) => taxYearOf(t.date) === year)),
    [transactions, year],
  )

  const filtered = React.useMemo(
    () =>
      yearScoped
        .filter((t) => (typeFilter === 'all' ? true : t.type === typeFilter))
        .filter((t) => (categoryFilter === 'all' ? true : t.category === categoryFilter))
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt)),
    [yearScoped, typeFilter, categoryFilter],
  )

  const sortedYearScoped = React.useMemo(
    () =>
      [...yearScoped].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt,
      ),
    [yearScoped],
  )

  const totals = React.useMemo(() => computeTotals(yearScoped), [yearScoped])
  const incomeBreakdown = React.useMemo(() => breakdownByCategory(yearScoped, 'income'), [yearScoped])
  const expenseBreakdown = React.useMemo(
    () => breakdownByCategory(yearScoped, 'expense'),
    [yearScoped],
  )

  const chartData: TrendPoint[] = React.useMemo(() => {
    if (year === 'all') return yearlyAggregate(transactions)
    return monthlySeries(transactions, year).map((m) => ({
      label: m.label,
      income: m.income,
      expenses: m.expenses,
    }))
  }, [transactions, year])

  const yearlyData: TrendPoint[] = React.useMemo(() => yearlyAggregate(transactions), [transactions])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(tx: Transaction) {
    setEditing(tx)
    setDialogOpen(true)
  }

  function handleExport() {
    const suffix = year === 'all' ? 'all-years' : String(year)
    downloadCSV(`ledger-${suffix}.csv`, toCSV(filtered))
  }

  const availableCategories =
    typeFilter === 'all' ? ALL_CATEGORIES : ALL_CATEGORIES.filter((c) => c.type === typeFilter)

  const meta = VIEW_META[view]
  const periodLabel = year === 'all' ? 'All years' : `Tax year ${year}`

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar
        active={view}
        onChange={setView}
        onAdd={openAdd}
        count={transactions.length}
        onClearData={clearAll}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background/90 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h1 className="font-display text-3xl text-foreground text-balance">
              {meta.title}
            </h1>
            <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(v === 'all' ? 'all' : Number(v))}
            >
              <SelectTrigger className="min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    Tax year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAdd} className="gap-2">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          {transactions.length === 0 ? (
            <EmptyState onAdd={openAdd} onSeed={() => importTransactions(withIds(SAMPLE))} />
          ) : view === 'overview' ? (
            <OverviewView
              totals={totals}
              periodLabel={periodLabel}
              year={year}
              yearScoped={yearScoped}
              chartData={chartData}
              incomeBreakdown={incomeBreakdown}
              expenseBreakdown={expenseBreakdown}
              recent={sortedYearScoped.slice(0, 6)}
              onViewAll={() => setView('transactions')}
              onEdit={openEdit}
            />
          ) : view === 'transactions' ? (
            <TransactionsView
              transactions={filtered}
              count={filtered.length}
              typeFilter={typeFilter}
              categoryFilter={categoryFilter}
              availableCategories={availableCategories}
              onTypeChange={(v) => {
                setTypeFilter(v)
                setCategoryFilter('all')
              }}
              onCategoryChange={setCategoryFilter}
              onEdit={openEdit}
              onDelete={deleteTransaction}
              onExport={handleExport}
            />
          ) : (
            <ReportsView
              totals={totals}
              periodLabel={periodLabel}
              yearlyData={yearlyData}
              incomeBreakdown={incomeBreakdown}
              expenseBreakdown={expenseBreakdown}
              onExport={handleExport}
              exportDisabled={filtered.length === 0}
            />
          )}
        </div>
      </main>

      <TransactionFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
    </div>
  )
}

function yearlyAggregate(transactions: Transaction[]): TrendPoint[] {
  const byYear = new Map<number, { income: number; expenses: number }>()
  for (const t of transactions) {
    const y = taxYearOf(t.date)
    const entry = byYear.get(y) ?? { income: 0, expenses: 0 }
    if (t.type === 'income') entry.income += t.amount
    else entry.expenses += t.amount
    byYear.set(y, entry)
  }
  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([y, v]) => ({ label: String(y), income: v.income, expenses: v.expenses }))
}

const SAMPLE: Omit<Transaction, 'id' | 'createdAt'>[] = [
  { type: 'income', date: thisYear('01-15'), amount: 5200, category: 'freelance', description: 'Website redesign — Acme Co.' },
  { type: 'income', date: thisYear('02-02'), amount: 3800, category: 'freelance', description: 'Retainer — Beta LLC' },
  { type: 'income', date: thisYear('03-20'), amount: 1250, category: 'interest', description: 'Brokerage dividends' },
  { type: 'income', date: thisYear('05-11'), amount: 6400, category: 'business', description: 'Product launch sales' },
  { type: 'income', date: thisYear('08-01'), amount: 4100, category: 'freelance', description: 'App build — Gamma' },
  { type: 'expense', date: thisYear('01-08'), amount: 49, category: 'software', description: 'Design tool subscription' },
  { type: 'expense', date: thisYear('02-14'), amount: 320, category: 'office', description: 'Standing desk' },
  { type: 'expense', date: thisYear('03-03'), amount: 680, category: 'travel', description: 'Client trip — flights' },
  { type: 'expense', date: thisYear('03-04'), amount: 210, category: 'meals', description: 'Client dinner' },
  { type: 'expense', date: thisYear('04-22'), amount: 1200, category: 'equipment', description: 'Laptop upgrade' },
  { type: 'expense', date: thisYear('06-30'), amount: 540, category: 'marketing', description: 'Ad campaign' },
  { type: 'expense', date: thisYear('07-15'), amount: 150, category: 'professional', description: 'Bookkeeping' },
]

function thisYear(mmdd: string) {
  return `${new Date().getFullYear()}-${mmdd}`
}

function withIds(rows: Omit<Transaction, 'id' | 'createdAt'>[]): Transaction[] {
  const base = Date.now()
  return rows.map((r, i) => ({
    ...r,
    id: `${base.toString(36)}-${i}`,
    createdAt: base - i,
  }))
}

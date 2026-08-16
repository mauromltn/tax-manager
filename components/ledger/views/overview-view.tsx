'use client'

import * as React from 'react'
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatCurrency,
  formatDate,
  type CategoryBreakdown,
  type Totals,
} from '@/lib/finance'
import { categoryLabel, type Transaction } from '@/lib/types'
import { SummaryCards } from '../summary-cards'
import { CategoryBreakdownList } from '../category-breakdown'
import { TrendChart, type TrendPoint } from '../trend-chart'

interface Props {
  totals: Totals
  periodLabel: string
  year: number | 'all'
  yearScoped: Transaction[]
  chartData: TrendPoint[]
  incomeBreakdown: CategoryBreakdown[]
  expenseBreakdown: CategoryBreakdown[]
  recent: Transaction[]
  onViewAll: () => void
  onEdit: (tx: Transaction) => void
}

export function OverviewView({
  totals,
  periodLabel,
  year,
  yearScoped,
  chartData,
  incomeBreakdown,
  expenseBreakdown,
  recent,
  onViewAll,
  onEdit,
}: Props) {
  const stats = React.useMemo(() => {
    const margin = totals.income > 0 ? (totals.net / totals.income) * 100 : 0
    const incomeMonths = new Set(
      yearScoped.filter((t) => t.type === 'income').map((t) => t.date.slice(0, 7)),
    ).size
    const avgIncome = incomeMonths > 0 ? totals.income / incomeMonths : 0
    const categoriesUsed = new Set(yearScoped.map((t) => t.category)).size
    const topExpense = expenseBreakdown[0]
    const topIncome = incomeBreakdown[0]
    return { margin, avgIncome, categoriesUsed, topExpense, topIncome }
  }, [totals, yearScoped, expenseBreakdown, incomeBreakdown])

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards totals={totals} periodLabel={periodLabel} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <section className="flex flex-col border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {year === 'all' ? 'Income vs expenses by year' : 'Income vs expenses by month'}
            </h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[1px] bg-income" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[1px] bg-expense" /> Expenses
              </span>
            </div>
          </div>
          <div className="p-5">
            <TrendChart data={chartData} />
          </div>
        </section>

        {/* At a glance */}
        <section className="flex flex-col border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              At a glance
            </h2>
          </div>
          <dl className="flex flex-col">
            <StatRow
              label="Profit margin"
              value={`${stats.margin >= 0 ? '' : '−'}${Math.abs(stats.margin).toFixed(0)}%`}
              accent={stats.margin >= 0 ? 'text-income' : 'text-expense'}
            />
            <StatRow label="Avg income / month" value={formatCurrency(stats.avgIncome)} />
            <StatRow
              label="Top income source"
              value={stats.topIncome ? categoryLabel(stats.topIncome.category) : '—'}
              sub={stats.topIncome ? formatCurrency(stats.topIncome.total) : undefined}
            />
            <StatRow
              label="Largest expense"
              value={stats.topExpense ? categoryLabel(stats.topExpense.category) : '—'}
              sub={stats.topExpense ? formatCurrency(stats.topExpense.total) : undefined}
            />
            <StatRow
              label="Categories used"
              value={String(stats.categoriesUsed)}
              last
            />
          </dl>
        </section>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryBreakdownList title="Income by category" items={incomeBreakdown} variant="income" />
        <CategoryBreakdownList
          title="Expenses by category"
          items={expenseBreakdown}
          variant="expense"
        />
      </div>

      {/* Recent activity */}
      <section className="flex flex-col border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Recent activity
          </h2>
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="size-3.5" />
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="flex flex-col">
            {recent.map((tx) => {
              const income = tx.type === 'income'
              return (
                <li key={tx.id} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onEdit(tx)}
                    className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-sm',
                        income ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense',
                      )}
                    >
                      {income ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownRight className="size-4" />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {categoryLabel(tx.category)}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {tx.description || formatDate(tx.date)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:block">
                      {formatDate(tx.date)}
                    </span>
                    <span
                      className={cn(
                        'shrink-0 font-mono text-sm font-medium tabular-nums',
                        income ? 'text-income' : 'text-expense',
                      )}
                    >
                      {income ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatRow({
  label,
  value,
  sub,
  accent,
  last,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
  last?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-5 py-3.5',
        !last && 'border-b border-border',
      )}
    >
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="flex items-baseline gap-2 text-right">
        {sub && <span className="font-mono text-xs tabular-nums text-muted-foreground">{sub}</span>}
        <span className={cn('font-mono text-sm font-semibold tabular-nums text-foreground', accent)}>
          {value}
        </span>
      </dd>
    </div>
  )
}

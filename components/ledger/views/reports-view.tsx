'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency, type CategoryBreakdown, type Totals } from '@/lib/finance'
import { SummaryCards } from '../summary-cards'
import { CategoryBreakdownList } from '../category-breakdown'
import { TrendChart, type TrendPoint } from '../trend-chart'

interface Props {
  totals: Totals
  periodLabel: string
  yearlyData: TrendPoint[]
  incomeBreakdown: CategoryBreakdown[]
  expenseBreakdown: CategoryBreakdown[]
  onExport: () => void
  exportDisabled: boolean
}

export function ReportsView({
  totals,
  periodLabel,
  yearlyData,
  incomeBreakdown,
  expenseBreakdown,
  onExport,
  exportDisabled,
}: Props) {
  const taxRows = [
    { label: 'Gross income', value: formatCurrency(totals.income), accent: 'text-income' },
    { label: 'Total expenses', value: `-${formatCurrency(totals.expenses)}`, accent: 'text-expense' },
    { label: 'Estimated deductible', value: formatCurrency(totals.deductible), accent: 'text-foreground' },
    {
      label: 'Net profit',
      value: formatCurrency(totals.net),
      accent: totals.net >= 0 ? 'text-income' : 'text-expense',
      strong: true,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards totals={totals} periodLabel={periodLabel} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Year-over-year chart */}
        <section className="flex flex-col border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Year-over-year
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
            <TrendChart data={yearlyData} />
          </div>
        </section>

        {/* Tax summary + export */}
        <section className="flex flex-col border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Tax summary · {periodLabel}
            </h2>
          </div>
          <dl className="flex flex-1 flex-col">
            {taxRows.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  'flex items-center justify-between gap-4 px-5 py-3.5',
                  i < taxRows.length - 1 && 'border-b border-border',
                  row.strong && 'bg-secondary/40',
                )}
              >
                <dt
                  className={cn(
                    'text-sm text-muted-foreground',
                    row.strong && 'font-medium text-foreground',
                  )}
                >
                  {row.label}
                </dt>
                <dd
                  className={cn(
                    'font-mono text-sm tabular-nums',
                    row.strong ? 'font-semibold' : 'font-medium',
                    row.accent,
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-border p-4">
            <Button onClick={onExport} disabled={exportDisabled} className="w-full gap-2">
              <Download className="size-4" />
              Export {periodLabel} CSV
            </Button>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
              Estimates are for planning only, not tax advice.
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryBreakdownList title="Income by category" items={incomeBreakdown} variant="income" />
        <CategoryBreakdownList
          title="Expenses by category"
          items={expenseBreakdown}
          variant="expense"
        />
      </div>
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { formatCurrency, type Totals } from '@/lib/finance'

interface Props {
  totals: Totals
  periodLabel: string
}

export function SummaryCards({ totals, periodLabel }: Props) {
  const margin = totals.income > 0 ? (totals.net / totals.income) * 100 : 0

  const cells = [
    {
      key: 'income',
      label: 'Total Income',
      value: formatCurrency(totals.income),
      accent: 'text-income',
      caption: periodLabel,
    },
    {
      key: 'expenses',
      label: 'Total Expenses',
      value: formatCurrency(totals.expenses),
      accent: 'text-expense',
      caption: periodLabel,
    },
    {
      key: 'net',
      label: 'Net Profit',
      value: formatCurrency(totals.net),
      accent: totals.net >= 0 ? 'text-income' : 'text-expense',
      caption: `${margin >= 0 ? '' : '−'}${Math.abs(margin).toFixed(0)}% margin`,
    },
    {
      key: 'deductible',
      label: 'Est. Deductible',
      value: formatCurrency(totals.deductible),
      accent: 'text-foreground',
      caption: 'Approx. write-offs',
    },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-4">
      {cells.map((c) => (
        <div key={c.key} className="flex flex-col gap-2 bg-card p-5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {c.label}
          </span>
          <span className={cn('font-mono text-2xl font-semibold tabular-nums lg:text-3xl', c.accent)}>
            {c.value}
          </span>
          <span className="text-xs text-muted-foreground">{c.caption}</span>
        </div>
      ))}
    </div>
  )
}

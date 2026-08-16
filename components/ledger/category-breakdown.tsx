'use client'

import { cn } from '@/lib/utils'
import { formatCurrency, type CategoryBreakdown } from '@/lib/finance'

interface Props {
  title: string
  items: CategoryBreakdown[]
  variant: 'income' | 'expense'
}

export function CategoryBreakdownList({ title, items, variant }: Props) {
  const total = items.reduce((sum, i) => sum + i.total, 0)
  const max = items.reduce((m, i) => Math.max(m, i.total), 0)
  const barColor = variant === 'income' ? 'bg-income' : 'bg-expense'
  const textColor = variant === 'income' ? 'text-income' : 'text-expense'

  return (
    <section className="flex flex-col border border-border bg-card">
      <div className="flex items-baseline justify-between border-b border-border px-5 py-3.5">
        <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
        <span className={cn('font-mono text-sm font-semibold tabular-nums', textColor)}>
          {formatCurrency(total)}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">No entries yet.</p>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => {
            const share = total > 0 ? (item.total / total) * 100 : 0
            return (
              <li
                key={item.category}
                className="flex flex-col gap-2 border-b border-border px-5 py-3 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {share.toFixed(0)}%
                    </span>
                    <span className="font-mono tabular-nums text-foreground">
                      {formatCurrency(item.total)}
                    </span>
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-none bg-muted">
                  <div
                    className={cn('h-full', barColor)}
                    style={{ width: `${max > 0 ? (item.total / max) * 100 : 0}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

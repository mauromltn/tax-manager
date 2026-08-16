'use client'

import { Plus, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState({ onAdd, onSeed }: { onAdd: () => void; onSeed: () => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-8 border border-border bg-card p-8 sm:p-12">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-sm bg-primary/10 text-primary">
          <PieChart className="size-5" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Getting started
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-4xl text-foreground text-balance">
          Track income and expenses for tax season.
        </h2>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          Log every entry against a tax category, watch your net profit and deductible expenses
          add up, then export a clean CSV at filing time. Everything stays private in this browser.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
        <div className="flex items-center gap-3 bg-card p-4">
          <ArrowUpRight className="size-4 text-income" />
          <span className="text-sm text-foreground">Record income by source</span>
        </div>
        <div className="flex items-center gap-3 bg-card p-4">
          <ArrowDownRight className="size-4 text-expense" />
          <span className="text-sm text-foreground">Categorize deductible expenses</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onAdd} className="gap-2">
          <Plus className="size-4" />
          Add your first transaction
        </Button>
        <Button variant="outline" onClick={onSeed}>
          Load sample data
        </Button>
      </div>
    </div>
  )
}

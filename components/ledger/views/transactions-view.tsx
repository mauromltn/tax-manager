'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoryLabel, type Category, type Transaction, type TransactionType } from '@/lib/types'
import { TransactionsTable } from '../transactions-table'

interface Props {
  transactions: Transaction[]
  count: number
  typeFilter: TransactionType | 'all'
  categoryFilter: string
  availableCategories: Category[]
  onTypeChange: (v: TransactionType | 'all') => void
  onCategoryChange: (v: string) => void
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
  onExport: () => void
}

export function TransactionsView({
  transactions,
  count,
  typeFilter,
  categoryFilter,
  availableCategories,
  onTypeChange,
  onCategoryChange,
  onEdit,
  onDelete,
  onExport,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
            {count}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {count === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as TransactionType | 'all')}>
            <SelectTrigger size="sm" className="min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger size="sm" className="min-w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {availableCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {categoryLabel(c.id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={count === 0}
            className="gap-2"
          >
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <TransactionsTable transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

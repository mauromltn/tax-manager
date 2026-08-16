'use client'

import { Pencil, Trash2, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/lib/finance'
import { categoryLabel, type Transaction } from '@/lib/types'

interface Props {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionsTable({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No transactions match your filters</p>
        <p className="text-sm text-muted-foreground">
          Add income or expenses, or adjust the filters above.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[110px] text-[11px] uppercase tracking-widest">Date</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest">Category</TableHead>
            <TableHead className="hidden text-[11px] uppercase tracking-widest sm:table-cell">
              Description
            </TableHead>
            <TableHead className="text-right text-[11px] uppercase tracking-widest">Amount</TableHead>
            <TableHead className="w-[92px] text-right text-[11px] uppercase tracking-widest">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const income = tx.type === 'income'
            return (
              <TableRow key={tx.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-sm',
                        income ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense',
                      )}
                    >
                      {income ? (
                        <ArrowUpRight className="size-3.5" />
                      ) : (
                        <ArrowDownRight className="size-3.5" />
                      )}
                    </span>
                    <span className="font-medium text-foreground">
                      {categoryLabel(tx.category)}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="hidden max-w-[240px] truncate text-muted-foreground sm:table-cell">
                  {tx.description || '—'}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-mono font-medium tabular-nums',
                    income ? 'text-income' : 'text-expense',
                  )}
                >
                  {income ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(tx)}
                      aria-label="Edit transaction"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(tx.id)}
                      aria-label="Delete transaction"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

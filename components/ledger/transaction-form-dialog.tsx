'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { categoriesForType, type Transaction, type TransactionType } from '@/lib/types'
import { useTransactions } from '@/lib/store'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing?: Transaction | null
}

export function TransactionFormDialog({ open, onOpenChange, editing }: Props) {
  const { addTransaction, updateTransaction } = useTransactions()

  const [type, setType] = React.useState<TransactionType>('expense')
  const [date, setDate] = React.useState(todayISO())
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  // Reset the form whenever the dialog opens.
  React.useEffect(() => {
    if (!open) return
    if (editing) {
      setType(editing.type)
      setDate(editing.date)
      setAmount(String(editing.amount))
      setCategory(editing.category)
      setDescription(editing.description)
    } else {
      setType('expense')
      setDate(todayISO())
      setAmount('')
      setCategory('')
      setDescription('')
    }
    setError(null)
  }, [open, editing])

  const categories = categoriesForType(type)

  function handleTypeChange(next: TransactionType) {
    setType(next)
    setCategory('') // categories differ per type
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number.parseFloat(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Enter an amount greater than 0.')
      return
    }
    if (!category) {
      setError('Choose a category.')
      return
    }
    const payload = {
      type,
      date,
      amount: Math.round(parsed * 100) / 100,
      category,
      description: description.trim(),
    }
    if (editing) updateTransaction(editing.id, payload)
    else addTransaction(payload)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
          <DialogDescription>
            Record income or an expense with a tax category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                aria-pressed={type === t}
                className={cn(
                  'rounded-md py-1.5 text-sm font-medium capitalize transition-colors',
                  type === t
                    ? t === 'income'
                      ? 'bg-income text-income-foreground'
                      : 'bg-expense text-expense-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pl-6 font-mono tabular-nums"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? 'Save changes' : 'Add transaction'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

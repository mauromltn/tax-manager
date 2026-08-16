'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onClearData: () => void
}

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const

export function SettingsDialog({ open, onOpenChange, count, onClearData }: Props) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [confirmClear, setConfirmClear] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // Reset the destructive confirm state whenever the modal opens/closes.
  React.useEffect(() => {
    if (!open) setConfirmClear(false)
  }, [open])

  const active = mounted ? theme : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Settings</DialogTitle>
          <DialogDescription>Manage appearance and your locally stored data.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-1">
          {/* Appearance */}
          <section className="flex flex-col gap-2.5">
            <p className="tracking-label text-[10px] font-medium uppercase text-muted-foreground">
              Appearance
            </p>
            <div
              role="radiogroup"
              aria-label="Theme"
              className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/40 p-1"
            >
              {THEMES.map((t) => {
                const isActive = active === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <t.icon className="size-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Data */}
          <section className="flex flex-col gap-2.5">
            <p className="tracking-label text-[10px] font-medium uppercase text-muted-foreground">
              Data
            </p>
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2.5">
              <span className="text-sm text-muted-foreground">Records stored in this browser</span>
              <span className="font-mono text-sm tabular-nums text-foreground">{count}</span>
            </div>
            <Button
              type="button"
              variant={confirmClear ? 'destructive' : 'outline'}
              disabled={count === 0}
              onClick={() => {
                if (!confirmClear) {
                  setConfirmClear(true)
                  return
                }
                onClearData()
                setConfirmClear(false)
                onOpenChange(false)
              }}
              className="justify-start gap-2"
            >
              {confirmClear ? (
                <>
                  <Check className="size-4" />
                  Confirm — delete all records
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Clear all data
                </>
              )}
            </Button>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Everything is stored privately on this device. Clearing data cannot be undone.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import * as React from 'react'
import { PieChart, ListChecks, FileText, Plus, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SettingsDialog } from './settings-dialog'

export type View = 'overview' | 'transactions' | 'reports'

const NAV: { id: View; label: string; icon: typeof PieChart }[] = [
  { id: 'overview', label: 'Overview', icon: PieChart },
  { id: 'transactions', label: 'Transactions', icon: ListChecks },
  { id: 'reports', label: 'Reports', icon: FileText },
]

interface Props {
  active: View
  onChange: (view: View) => void
  onAdd: () => void
  count: number
  onClearData: () => void
}

export function Sidebar({ active, onChange, onAdd, count, onClearData }: Props) {
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return (
    <aside className="flex shrink-0 flex-col border-border bg-sidebar lg:h-dvh lg:w-64 lg:border-r">
      {/* Brand — opens settings */}
      <div className="border-b border-border p-3">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          className="group flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
        >
          <span className="font-display flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-lg text-primary-foreground">
            M
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-display truncate text-lg text-foreground">Mauro</p>
            <p className="tracking-label text-[10px] uppercase text-muted-foreground">Tax Tracker</p>
          </div>
          <Settings className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        </button>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        count={count}
        onClearData={onClearData}
      />

      {/* Nav */}
      <nav className="flex gap-1 p-3 lg:flex-1 lg:flex-col">
        {NAV.map((item, i) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex flex-1 items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors lg:flex-none',
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden
              />
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              <span className="hidden font-mono text-[11px] tabular-nums text-muted-foreground/70 lg:inline">
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="hidden flex-col gap-3 border-t border-border p-3 lg:flex">
        <Button onClick={onAdd} className="w-full justify-start gap-2">
          <Plus className="size-4" />
          Add transaction
        </Button>
        <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-mono tabular-nums text-foreground">{count}</span> record
          {count === 1 ? '' : 's'} stored privately in this browser.
        </p>
      </div>
    </aside>
  )
}

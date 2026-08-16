export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  date: string // ISO date string (yyyy-mm-dd)
  amount: number // positive number, in dollars
  category: string
  description: string
  createdAt: number
}

export interface Category {
  id: string
  label: string
  type: TransactionType
  /** Whether this expense is typically tax deductible (informational). */
  deductible?: boolean
}

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', label: 'Salary / Wages', type: 'income' },
  { id: 'freelance', label: 'Freelance / 1099', type: 'income' },
  { id: 'business', label: 'Business Revenue', type: 'income' },
  { id: 'interest', label: 'Interest & Dividends', type: 'income' },
  { id: 'rental', label: 'Rental Income', type: 'income' },
  { id: 'other-income', label: 'Other Income', type: 'income' },
]

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'office', label: 'Office & Supplies', type: 'expense', deductible: true },
  { id: 'software', label: 'Software & Subscriptions', type: 'expense', deductible: true },
  { id: 'travel', label: 'Travel', type: 'expense', deductible: true },
  { id: 'meals', label: 'Meals (50%)', type: 'expense', deductible: true },
  { id: 'home-office', label: 'Home Office', type: 'expense', deductible: true },
  { id: 'vehicle', label: 'Vehicle & Mileage', type: 'expense', deductible: true },
  { id: 'marketing', label: 'Marketing & Ads', type: 'expense', deductible: true },
  { id: 'professional', label: 'Professional Services', type: 'expense', deductible: true },
  { id: 'utilities', label: 'Utilities & Rent', type: 'expense', deductible: true },
  { id: 'equipment', label: 'Equipment', type: 'expense', deductible: true },
  { id: 'health', label: 'Health & Insurance', type: 'expense', deductible: true },
  { id: 'other-expense', label: 'Other Expense', type: 'expense', deductible: false },
]

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

export function categoriesForType(type: TransactionType): Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function categoryLabel(id: string): string {
  return ALL_CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export function isDeductible(id: string): boolean {
  return ALL_CATEGORIES.find((c) => c.id === id)?.deductible ?? false
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  errors: string[] | null;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  expiresAt: string;
  user: UserInfoDto;
}

export interface UserInfoDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  expenseCount: number;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  name: string;
  description: string;
}

export interface ExpenseDto {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: number;
  categoryName: string;
  totalMonth: number;
  totalCategory: number;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  date: string;
  categoryId: number;
}

export interface UpdateExpenseDto {
  description: string;
  amount: number;
  date: string;
  categoryId: number;
}

export interface BudgetDto {
  monthYear: string;
  amount: number;
  month: number;
  year: number;
  spentAmount: number;
  remainingAmount: number;
  isOverBudget: boolean;
  total: number;
  percentSpent: number;
  percentPending: number;
}

export interface CreateBudgetDto {
  amount: number;
  month: number;
  year: number;
}

export interface UpdateBudgetDto {
  amount: number;
  month: number;
  year: number;
}

export interface ExpenseSummaryDto {
  totalAmount: number;
  totalCount: number;
  averagePerDay: number;
  byCategory: Record<string, number>;
}

export interface ExpenseMonthDto {
  month: number;
  year: number;
}

export interface MonthlySummaryDto {
  month: number;
  year: number;
  totalAmount: number;
  totalCount: number;
  budgetAmount: number | null;
  remainingBudget: number | null;
  isOverBudget: boolean;
  byCategory: Record<string, number>;
}

// FinancialLine input validation
// Validation functions for create and update

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isNonEmptyString(val: any): boolean {
  return typeof val === 'string' && val.trim().length > 0;
}

function isFiniteNumber(val: any): boolean {
  return typeof val === 'number' && Number.isFinite(val);
}

function isValidAmount(val: any): boolean {
  if (val === null || val === undefined) return false;
  const num = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(num) && !Number.isNaN(num);
}

// Optionally, you can add more sophisticated checks for budgetStream/costCategory
function isValidBudgetStream(val: any): boolean {
  // Accept non-empty string for now
  return val === undefined || isNonEmptyString(val);
}

function isValidCostCategory(val: any): boolean {
  // Accept non-empty string for now
  return val === undefined || isNonEmptyString(val);
}

export function validateCreateFinancialLineInput(input: any): ValidationResult {
  const errors: string[] = [];
  // id: allow repository to generate if not provided
  if ('id' in input && !isNonEmptyString(input.id)) {
    errors.push('id, if provided, must be a non-empty string');
  }
  if (!isNonEmptyString(input.name)) {
    errors.push('name is required and must be a non-empty string');
  }
  if (!isNonEmptyString(input.programId)) {
    errors.push('programId is required and must be a non-empty string');
  }
  if (!isValidAmount(input.forecastAmount)) {
    errors.push('forecastAmount is required and must be a finite number');
  }
  if (!isValidAmount(input.actualAmount)) {
    errors.push('actualAmount is required and must be a finite number');
  }
  if (!isNonEmptyString(input.fiscalYearId)) {
    errors.push('fiscalYearId is required and must be a non-empty string');
  }
  if (!isNonEmptyString(input.fiscalPeriodId)) {
    errors.push('fiscalPeriodId is required and must be a non-empty string');
  }
  if ('budgetStream' in input && !isValidBudgetStream(input.budgetStream)) {
    errors.push('budgetStream, if provided, must be a non-empty string');
  }
  if ('costCategory' in input && !isValidCostCategory(input.costCategory)) {
    errors.push('costCategory, if provided, must be a non-empty string');
  }
  return { valid: errors.length === 0, errors };
}

export function validateUpdateFinancialLineInput(input: any): ValidationResult {
  const errors: string[] = [];
  // Only validate fields that are present
  if ('id' in input && !isNonEmptyString(input.id)) {
    errors.push('id, if provided, must be a non-empty string');
  }
  if ('name' in input && !isNonEmptyString(input.name)) {
    errors.push('name, if provided, must be a non-empty string');
  }
  if ('programId' in input && !isNonEmptyString(input.programId)) {
    errors.push('programId, if provided, must be a non-empty string');
  }
  if ('forecastAmount' in input && !isValidAmount(input.forecastAmount)) {
    errors.push('forecastAmount, if provided, must be a finite number');
  }
  if ('actualAmount' in input && !isValidAmount(input.actualAmount)) {
    errors.push('actualAmount, if provided, must be a finite number');
  }
  if ('fiscalYearId' in input && !isNonEmptyString(input.fiscalYearId)) {
    errors.push('fiscalYearId, if provided, must be a non-empty string');
  }
  if ('fiscalPeriodId' in input && !isNonEmptyString(input.fiscalPeriodId)) {
    errors.push('fiscalPeriodId, if provided, must be a non-empty string');
  }
  if ('budgetStream' in input && !isValidBudgetStream(input.budgetStream)) {
    errors.push('budgetStream, if provided, must be a non-empty string');
  }
  if ('costCategory' in input && !isValidCostCategory(input.costCategory)) {
    errors.push('costCategory, if provided, must be a non-empty string');
  }
  return { valid: errors.length === 0, errors };
}

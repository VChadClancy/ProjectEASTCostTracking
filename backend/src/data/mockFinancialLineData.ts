// Mock Financial Line data for backend

export const financialLines = [
  {
    id: 'fin-1',
    programId: 'program-1',
    projectId: 'project-1',
    carId: 'car-1',
    workstreamId: 'ws-1',
    fiscalYearId: 'FY25',
    fiscalPeriodId: 'P1',
    budgetStream: 'OPEX',
    name: 'OPEX',
    amount: 500000,
    actualAmount: 510000,
    forecastAmount: 500000,
    fiscalYear: 'FY25'
  },
  {
    id: 'fin-2',
    programId: 'program-1',
    projectId: 'project-2',
    carId: 'car-2',
    workstreamId: 'ws-2',
    fiscalYearId: 'FY25',
    fiscalPeriodId: 'P2',
    budgetStream: 'CAPEX',
    name: 'CAPEX',
    amount: 1200000,
    actualAmount: 1200000,
    forecastAmount: 1150000,
    fiscalYear: 'FY25'
  },
  {
    id: 'fin-3',
    programId: 'program-1',
    projectId: 'project-1',
    carId: 'car-1',
    workstreamId: 'ws-1',
    fiscalYearId: 'FY26',
    fiscalPeriodId: 'P1',
    budgetStream: 'OPEX',
    name: 'OPEX',
    amount: 600000,
    actualAmount: 600000,
    forecastAmount: 600000,
    fiscalYear: 'FY26'
  }
];

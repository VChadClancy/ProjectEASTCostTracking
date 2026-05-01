import { FinancialLine } from './financialLineTypes';
import { getPrograms, getProjects, getCars, getWorkstreams, getFiscalYears, getFiscalPeriods } from './programService';

// Generate mock financial lines connected to existing mock data
export function getFinancialLines(): FinancialLine[] {
  const programs = getPrograms();
  const projects = getProjects();
  const cars = getCars();
  const workstreams = getWorkstreams();
  const fiscalYears = getFiscalYears();
  const fiscalPeriods = getFiscalPeriods();

  // Example: create a few lines for each program, some with project/car, some without
  const lines: FinancialLine[] = [];
  let idCounter = 1;
  for (const program of programs) {
    // Run line (no project/car)
    lines.push({
      id: `FL${idCounter++}`,
      programId: program.id,
      fiscalYearId: fiscalYears[0]?.id || 'FY1',
      fiscalPeriodId: fiscalPeriods[0]?.id || 'P1',
      budgetStream: 'Run',
      costType: 'OPEX',
      costCategoryKey: 'run-costs',
      forecastAmount: 10000,
      actualAmount: 9500,
      varianceAmount: 9500 - 10000,
    });
    // Delivery line (with project)
    if (projects.length > 0) {
      lines.push({
        id: `FL${idCounter++}`,
        programId: program.id,
        projectId: projects[0].id,
        fiscalYearId: fiscalYears[0]?.id || 'FY1',
        fiscalPeriodId: fiscalPeriods[1]?.id || 'P2',
        budgetStream: 'Delivery',
        costType: 'CAPEX',
        costCategoryKey: 'delivery-costs',
        allocationOwner: 'PMO',
        forecastAmount: 20000,
        actualAmount: 21000,
        varianceAmount: 21000 - 20000,
      });
    }
    // Delivery line (with CAR)
    if (cars.length > 0) {
      lines.push({
        id: `FL${idCounter++}`,
        programId: program.id,
        carId: cars[0].id,
        workstreamId: workstreams[0]?.id,
        fiscalYearId: fiscalYears[0]?.id || 'FY1',
        fiscalPeriodId: fiscalPeriods[2]?.id || 'P3',
        budgetStream: 'Delivery',
        costType: 'CAPEX',
        costCategoryKey: 'delivery-costs',
        forecastAmount: 5000,
        actualAmount: 4800,
        varianceAmount: 4800 - 5000,
      });
    }
  }
  return lines;
}

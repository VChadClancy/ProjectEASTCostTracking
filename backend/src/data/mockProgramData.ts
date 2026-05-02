// Mock Program, Project, CAR, Workstream, Resource data for backend
// IDs are stable and readable

export const programs = [
  {
    id: 'program-1',
    name: 'Digital Transformation',
    description: 'Modernize business processes and IT systems.'
  }
];

export const projects = [
  {
    id: 'project-1',
    programId: 'program-1',
    name: 'ERP Implementation',
    status: 'active'
  },
  {
    id: 'project-2',
    programId: 'program-1',
    name: 'Cloud Migration',
    status: 'planning'
  },
  {
    id: 'project-3',
    programId: 'program-1',
    name: 'Data Analytics Platform',
    status: 'active'
  }
];

export const cars = [
  {
    id: 'car-1',
    projectId: 'project-1',
    name: 'ERP Vendor Selection',
    status: 'complete'
  },
  {
    id: 'car-2',
    projectId: 'project-1',
    name: 'ERP Rollout',
    status: 'active'
  },
  {
    id: 'car-3',
    projectId: 'project-2',
    name: 'Cloud Assessment',
    status: 'active'
  }
];

export const workstreams = [
  {
    id: 'ws-1',
    carId: 'car-1',
    name: 'Requirements Gathering'
  },
  {
    id: 'ws-2',
    carId: 'car-2',
    name: 'System Integration'
  },
  {
    id: 'ws-3',
    carId: 'car-2',
    name: 'User Training'
  },
  {
    id: 'ws-4',
    carId: 'car-3',
    name: 'Cloud Readiness Review'
  },
  {
    id: 'ws-5',
    carId: 'car-3',
    name: 'Migration Planning'
  }
];

export const resources = [
  {
    id: 'res-1',
    name: 'Alice Smith',
    role: 'Project Manager'
  },
  {
    id: 'res-2',
    name: 'Bob Lee',
    role: 'Business Analyst'
  },
  {
    id: 'res-3',
    name: 'Carol Jones',
    role: 'Developer'
  }
];

export const resourceAvailability = [
  { resourceId: 'res-1', available: true },
  { resourceId: 'res-2', available: false },
  { resourceId: 'res-3', available: true }
];

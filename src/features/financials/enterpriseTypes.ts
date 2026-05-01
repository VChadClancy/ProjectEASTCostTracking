// Shared enterprise metadata types/interfaces for EPFOS
// Aligned to architecture docs, simple and type-focused

export type EntityStatus = 'Active' | 'Inactive' | 'Draft' | 'Archived';

export type SourceSystem = 'EPFOS' | 'External' | 'Manual' | string;

export interface EnterpriseMetadata {
  id: string;
  status: EntityStatus;
  sourceSystem?: SourceSystem;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedBy?: string;
  updatedAt?: string; // ISO date string
  version?: number;
}

export interface AuditEvent {
  id: string;
  entityType: string;
  entityId: string;
  eventType: string;
  eventTime: string; // ISO date string
  userId: string;
  details?: string;
}

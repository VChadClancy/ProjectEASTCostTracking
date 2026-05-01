import { describe, it, expect } from 'vitest';

// Basic type-focused tests for enterpriseTypes
import type {
  EntityStatus,
  SourceSystem,
  EnterpriseMetadata,
  AuditEvent
} from './enterpriseTypes';

describe('EnterpriseMetadata', () => {
  it('should allow creation of a valid metadata object', () => {
    const meta: EnterpriseMetadata = {
      id: '1',
      status: 'Active',
      sourceSystem: 'EPFOS',
      createdBy: 'user',
      createdAt: new Date().toISOString(),
      updatedBy: 'user',
      updatedAt: new Date().toISOString(),
      version: 1
    };
    expect(meta.status).toBe('Active');
  });
});

describe('AuditEvent', () => {
  it('should allow creation of a valid audit event', () => {
    const event: AuditEvent = {
      id: 'ae1',
      entityType: 'Program',
      entityId: 'p1',
      eventType: 'CREATE',
      eventTime: new Date().toISOString(),
      userId: 'user',
      details: 'Created program'
    };
    expect(event.eventType).toBe('CREATE');
  });
});

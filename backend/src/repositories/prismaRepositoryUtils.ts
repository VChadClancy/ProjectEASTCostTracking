export class NotImplementedError extends Error {
  constructor() {
    super('Prisma repository is not implemented yet.');
    this.name = 'NotImplementedError';
  }
}

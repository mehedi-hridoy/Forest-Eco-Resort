import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma runs without its native (Rust) query engine (engineType = "client" in schema.prisma):
// queries go through the pure-JS "pg" driver, so nothing platform-specific has to run on the host.
export function createDb(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('DATABASE_URL is not set.');
  // A small pool: shared hosting limits processes and database connections per account.
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 5 }) });
}

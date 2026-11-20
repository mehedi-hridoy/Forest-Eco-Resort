import 'dotenv/config';
import type { PrismaClient } from '@prisma/client';
import { createDb } from './prisma-client';
const globalDb = globalThis as unknown as { forestDb?: PrismaClient };
export const db = globalDb.forestDb || createDb();
globalDb.forestDb = db;

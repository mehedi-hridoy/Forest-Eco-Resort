import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const globalDb = globalThis as unknown as { forestDb?: PrismaClient };
export const db = globalDb.forestDb || new PrismaClient();
globalDb.forestDb = db;

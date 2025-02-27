import { PrismaClient } from '@prisma/client/edge';

declare global {
  var prismaEdge: PrismaClient | undefined;
}

const prismaEdge = global.prismaEdge || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prismaEdge = prismaEdge;
}

export { prismaEdge };

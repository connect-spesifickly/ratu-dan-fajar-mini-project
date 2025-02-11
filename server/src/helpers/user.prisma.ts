import { prisma } from "../config";
export const getUserByEmail = async (email: string) =>
  prisma.users.findUnique({
    where: {
      email,
    },
  });

export const getEventUserById = async (user_id: number) =>
  prisma.events.findMany({
    where: {
      user_id,
    },
    select: {
      event_id: true,
    },
  });

export const getTransactionUserByEventId = async (event_id: number) =>
  prisma.transactions.findMany({
    where: {
      event_id,
    },
    select: {
      transaction_id: true,
    },
  });

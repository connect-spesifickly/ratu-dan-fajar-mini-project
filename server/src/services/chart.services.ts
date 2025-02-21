import { Request } from "express";
import { jwt_secret, prisma } from "../config";
import { Prisma, Role } from "@prisma/client";
import { hashedPassword } from "../helpers/bcrypt";
import { compare } from "bcrypt";
import { getEventUserById, getUserByEmail } from "../helpers/user.prisma";
import { ErrorHandler } from "../helpers/response.handler";
import { UserLogin } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";
import { generateAuthToken } from "../helpers/token";

class ChartService {
  async transaction(req: Request) {
    const user = await req.user?.user_id;
    const eventUser = await getEventUserById(user as number);
    const eventIds = eventUser.map((event) => event.event_id);
    console.log("user ID", user);
    const transactions = await prisma.transactions.findMany({
      where: {
        event_id: { in: eventIds },
        status: "done",
      },
      select: {
        created_at: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    console.log("Transactions Found:", transactions);

    const transactionCountByMonth: Record<string, number> = {};

    // Hitung jumlah transaksi berdasarkan bulan
    transactions.forEach((t) => {
      const month = new Date(t.created_at).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      transactionCountByMonth[month] =
        (transactionCountByMonth[month] || 0) + 1;
    });

    const formattedData = Object.entries(transactionCountByMonth).map(
      ([month, transaction]) => ({
        month,
        transaction,
      })
    );

    console.log("Chart Transaction Data:", formattedData);

    return formattedData;
  }
}

export default new ChartService();

import { Request } from "express";
import { getEventUserById, getUserByEmail } from "../helpers/user.prisma";
import { UserLogin } from "../interfaces/user.interface";
import { prisma } from "../config";
import { dashInfo } from "../helpers/dash.prisma";

class DashService {
  async dashInfo(req: Request) {
    const user = await req.user?.user_id;
    const event_id = await getEventUserById(user as number);
    console.log("ini info user_id", user);
    console.log("ini info total_event", event_id.length);
    console.log("ini info event_id", event_id);
    const { total_transaction, total_ticket_sold, total_sold } = await dashInfo(
      event_id
    );
    return {
      total_event: event_id.length,
      total_transaction,
      total_ticket_sold,
      total_sold,
    };
  }
}
export default new DashService();

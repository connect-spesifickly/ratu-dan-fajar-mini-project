import { Request } from "express";
import { getEventUserById, getUserByEmail } from "../helpers/user.prisma";
import { UserLogin } from "../interfaces/user.interface";
import { prisma } from "../config";
import { dashInfo } from "../helpers/dash.prisma";
import { Prisma } from "@prisma/client";

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

  async updateEvent(req: Request) {
    const {
      event_img,
      event_title,
      start_at,
      end_at,
      category,
      description,
      avaiable_slot,
      price,
    } = req.body;
    const user = await req.user?.user_id;
    const event_id = await getEventUserById(user as number);
    const event_id_by_slug = await prisma.events.findMany({
      where: {
        slug: req.params.id,
      },
      select: {
        event_id: true,
      },
    });
    console.log("ini info event_id", event_id_by_slug, "end");
    let eventId: number;
    if (
      event_id.some((event) => event.event_id === event_id_by_slug[0].event_id)
    ) {
      eventId = event_id_by_slug[0].event_id;
    } else {
      throw new Error("event not found");
    }
    const data: Prisma.EventsUpdateInput = {};
    if (event_img) data.event_img = event_img;
    if (event_title) data.event_title = event_title;
    if (start_at) data.start_at = start_at;
    if (end_at) data.end_at = end_at;
    if (category.category_by_location) {
      const category_by_location = category.category_by_location;
      console.log("ini category_by_location", category_by_location);
      const findCategory = await prisma.categories.findUnique({
        where: {
          category_by_location,
        },
      });
      if (findCategory) {
        data.category = {
          connect: { category_id: findCategory.category_id },
        };
      }
      if (!findCategory) {
        // category not found in database, create new category
        const newCategory = await prisma.categories.create({
          data: {
            category_by_location,
          },
        });
        data.category = {
          connect: { category_id: newCategory.category_id },
        };
      }
    }
    if (description) data.description = description;
    if (avaiable_slot) data.avaiable_slot = avaiable_slot;
    if (price) data.price = price;

    await prisma.events.update({
      where: {
        event_id: eventId,
      },
      data,
    });
    return prisma.events.findUnique({
      where: {
        event_id: eventId,
      },
      select: {
        event_id: true,
        event_title: true,
        event_img: true,
        category: true,
        start_at: true,
        end_at: true,
        description: true,
        avaiable_slot: true,
        price: true,
      },
    });
  }

  async getEvents(req: Request) {
    const user = await req.user?.user_id;
    const event_id = await getEventUserById(user as number);
    const page = req.query.page || 1;
    return await prisma.events.findMany({
      where: {
        event_id: {
          in: event_id.map((event) => event.event_id),
        },
      },
      select: {
        event_id: true,
        event_title: true,
        event_img: true,
        category: true,
        start_at: true,
        end_at: true,
        slug: true,
      },
      skip: (Number(page) - 1) * 5,
      take: 5,
    });
  }

  async getEvent(req: Request) {
    const user = await req.user?.user_id;
    const event_id = await getEventUserById(user as number);
    const event_id_by_slug = await prisma.events.findMany({
      where: {
        slug: req.params.id,
      },
      select: {
        event_id: true,
      },
    });
    console.log("ini info event_id", event_id_by_slug, "end");
    let eventId: number;
    if (
      event_id.some((event) => event.event_id === event_id_by_slug[0].event_id)
    ) {
      eventId = event_id_by_slug[0].event_id;
    } else {
      throw new Error("event not found");
    }

    const event = await prisma.events.findUnique({
      where: {
        event_id: eventId,
      },
      select: {
        event_id: true,
        event_title: true,
        event_img: true,
        category: true,
        start_at: true,
        end_at: true,
        description: true,
        slug: true,
        transaction: {
          where: {
            status: "done",
          },
          select: {
            transaction_id: true,
            quantity: true,
            user: {
              select: {
                username: true,
              },
            },

            created_at: true,
            expired_at: true,
            total_price: true,
          },
        },
        avaiable_slot: true,
        filled_slots: true,
      },
    });
    console.log("ini info event", event);
    return event;
  }

  async updateTransaction(req: Request) {
    const user = await req.user?.user_id;
    const event_id = await getEventUserById(user as number);
    const event_id_by_slug = await prisma.events.findMany({
      where: {
        slug: req.params.id,
      },
      select: {
        event_id: true,
      },
    });
    console.log("ini info event_id", event_id_by_slug, "end");
    let eventId: number;
    if (
      event_id.some((event) => event.event_id === event_id_by_slug[0].event_id)
    ) {
      eventId = event_id_by_slug[0].event_id;
    } else {
      throw new Error("event not found");
    }
    const { transaction_id, status } = req.body;
    const data: Prisma.TransactionsUpdateInput = {};
    if (status) data.status = status;
    if (status == "rejected") {
      const userId = await prisma.transactions.findUnique({
        where: {
          transaction_id,
        },
        select: {
          user_id: true,
        },
      });
      const currentDate = new Date();
      const expiredDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 3)
      );
      const kuponUsed = await prisma.transactions.findUnique({
        where: {
          transaction_id,
        },
        select: {
          kupon_used: true,
        },
      });
      await prisma.kuponUsers.create({
        data: {
          kupon_value: kuponUsed?.kupon_used,
          expired_at: expiredDate, // Set appropriate expiration date
          user: {
            connect: { user_id: userId?.user_id },
          },
        },
      });
      const poinUsed = await prisma.transactions.findUnique({
        where: {
          transaction_id,
        },
        select: {
          point_used: true,
        },
      });
      await prisma.poinUsers.create({
        data: {
          poin_value: poinUsed?.point_used,
          expired_at: expiredDate, // Set appropriate expiration date
          user: {
            connect: { user_id: userId?.user_id },
          },
        },
      });
    }
    if (status) {
      await prisma.transactions.update({
        where: {
          transaction_id,
        },
        data,
      });
    }
    return await prisma.events.findUnique({
      where: {
        event_id: eventId,
      },
      select: {
        event_title: true,
        transaction: {
          select: {
            transaction_id: true,
            status: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }
}
export default new DashService();

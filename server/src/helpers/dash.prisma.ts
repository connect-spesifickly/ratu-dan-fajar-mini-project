import { prisma } from "../config";

export const dashInfo = async (event_id: { event_id: number }[]) => {
  let total_transaction = 0;
  for (let i = 0; i < event_id.length; i++) {
    const event_transaction = await prisma.transactions.findMany({
      where: {
        event_id: event_id[i].event_id,
      },
      select: {
        transaction_id: true,
      },
    });
    total_transaction += event_transaction.length;
  }
  console.log("ini info total_transaction", total_transaction);
  let total_ticket_sold = 0;
  for (let i = 0; i < event_id.length; i++) {
    const event_transaction_ticket_quantity =
      await prisma.transactions.findMany({
        where: {
          event_id: event_id[i].event_id,
        },
        select: {
          quantity: true,
        },
      });

    event_transaction_ticket_quantity.forEach((e) => {
      total_ticket_sold += e.quantity;
    });
  }
  console.log("ini info jumlah tiket tejual", total_ticket_sold);
  let total_sold = 0;
  for (let i = 0; i < event_id.length; i++) {
    const event_transaction_ticket_price = await prisma.transactions.findMany({
      where: {
        event_id: event_id[i].event_id,
      },
      select: {
        total_price: true,
      },
    });
    event_transaction_ticket_price.forEach((e) => {
      total_sold += e.total_price;
    });
  }
  console.log("ini info total penjualan", total_sold);
  return {
    total_transaction,
    total_ticket_sold,
    total_sold,
  };
};

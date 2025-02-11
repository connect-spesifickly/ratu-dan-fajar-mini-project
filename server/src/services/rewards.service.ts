import { prisma } from "../config";

class RewardsController {
  async getKuponAndPoin(data: {
    applied_reference_code: string;
    email: string;
  }) {
    const { applied_reference_code, email } = data;
    // cek apakah kode referral sama dengan kode referral yang ada di database
    const referrer = await prisma.users.findUnique({
      where: {
        reference_code: applied_reference_code,
      },
      select: {
        user_id: true,
      },
    });
    // mencari user yang menggunakan kode referral
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });
    // jika sama maka tambahkan poin dan kupon
    if (referrer && user?.user_id !== undefined) {
      const currentDate = new Date();
      const expiredDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 3)
      );
      await prisma.kuponUsers.create({
        data: {
          user_id: user.user_id,
          kupon_value: 10000,
          expired_at: expiredDate,
        },
      });
      await prisma.poinUsers.create({
        data: {
          user_id: referrer?.user_id ?? 0,
          poin_value: 10000,
          expired_at: expiredDate,
        },
      });
    }
    console.log("Kupon dan Poin berhasil ditambahkan");
  }
}
export default new RewardsController();

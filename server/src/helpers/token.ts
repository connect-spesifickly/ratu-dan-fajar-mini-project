import { sign } from "jsonwebtoken";
import { UserLogin } from "../interfaces/user.interface";
import { ErrorHandler } from "./response.handler";
import { getUserByEmail } from "./user.prisma";
import { jwt_secret, refresh_jwt_secret } from "../config";

export const generateAuthToken = async (user?: UserLogin, email?: string) => {
  //kalo nda` lewat login bisa lewat yang lain, untuk generate token, dari email misalnya
  const existingUser = user || ((await getUserByEmail(email!)) as UserLogin);
  if (!existingUser) throw new ErrorHandler(401, "unauthorize email");
  delete existingUser.password;
  const access_token = sign(existingUser, jwt_secret, {
    expiresIn: "20m",
  });
  const refresh_token = sign(
    { email: existingUser.email },
    refresh_jwt_secret,
    {
      expiresIn: "1h",
    }
  );
  return {
    access_token,
    refresh_token,
  };
};

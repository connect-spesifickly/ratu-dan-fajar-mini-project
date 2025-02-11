import { Request } from "express";
import { jwt_secret, prisma } from "../config";
import { Prisma, Role } from "@prisma/client";
import { hashedPassword } from "../helpers/bcrypt";
import { compare } from "bcrypt";
import { getUserByEmail } from "../helpers/user.prisma";
import { ErrorHandler } from "../helpers/response.handler";
import { UserLogin } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";
import { generateAuthToken } from "../helpers/token";

class AuthService {
  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = (await getUserByEmail(email)) as UserLogin;
    // console.log(await getUserByEmail(email));
    if (!user) {
      throw new ErrorHandler(401, "the email that you`ve entered is incorrect");
    } else if (!(await compare(password, user.password as string)))
      throw new ErrorHandler(
        401,
        "the password that you`ve entered is incorrect"
      );
    return await generateAuthToken(user); // access token dan refres token
  }
  // return await prisma.users.findUnique({
  //   select: {
  //     user_id: true,
  //     password: true,
  //     username: true,
  //     img_src: true,
  //     role: true,
  //   },
  //   where: {
  //     email,
  //     password,
  //   },
  // });

  // return {
  //   id: user.user_id,
  //   username: user.username,
  //   email: user.email,
  //   img_src: user.img_src,
  //   role: user.role,
  // };

  async register(data: {
    email: string;
    password: string;
    username: string;
    role: Role;
    applied_reference_code: string;
  }) {
    const { email, password, username, role, applied_reference_code } = data;
    const user = (await getUserByEmail(email)) as UserLogin;
    if (user) {
      throw new ErrorHandler(404, "email alredy exist");
    } else if (!user) {
      await prisma.users.create({
        data: {
          email,
          password: await hashedPassword(password),
          username,
          role, // or any default role
          applied_reference_code, // or any default value
        },
      });
    }
  }

  async updateUser(req: Request) {
    const { email, password, username, img_src } = req.body;
    const user_id = Number(req.user?.user_id);
    const data: Prisma.UsersUpdateInput = {};
    if (img_src) data.img_src = img_src;
    if (password) data.password = await hashedPassword(password);
    if (username) data.username = username;

    await prisma.users.update({
      where: {
        user_id,
      },
      data,
    });
    return await prisma.users.findUnique({
      select: {
        user_id: true,
        username: true,
        img_src: true,
      },
      where: {
        user_id,
      },
    });
  }

  async refreshToken(req: Request) {
    if (!req.user?.email) throw new ErrorHandler(401, "Invalid Token");
    console.log(req.user);
    return await generateAuthToken(undefined, req.user?.email);
  }
}

export default new AuthService();

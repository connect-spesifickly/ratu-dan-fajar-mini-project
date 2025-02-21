import express, { Application, json } from "express";
import request from "supertest";
import { App } from "../app";

const appInstance = new App().app;

describe("testing route /api/user", () => {
  it("should return data of user", async () => {
    const loginData: { email: string; password: string } = {
      email: "fajar3@mail.com",
      password: "fajar3",
    };
    const response = await request(appInstance)
      .post("/api/auth/login")
      .send(loginData);
    expect(response.body).toMatchObject({
      message: "login success",
      data: {
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      },
    });
  });
});

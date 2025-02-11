// "use server";

// import { api } from "./api";

// export const login = async (credentials: Partial<Record<string, unknown>>) => {
//   const res = await api("/auth", "POST", {
//     body: credentials,
//     contentType: "application/json",
//   });
//   console.log(res);

//   return {
//     access_token: res.data.access_token,
//     refresh_token: res.data.refresh_token,
//   };
// };

// export const register = async (newUser: {
//   email: string;
//   username: string;
//   password: string;
// }) => {
//   await api("/auth/neew", "POST", {
//     body: newUser,
//     contentType: "application/json",
//   });
//   return "New user has been registered";
// };

// export const refreshToken = async (token: string) => {
//   const res = await api("/auth/token", "POST", {}, token); // {} = body kosong dan, token = hanya passing token aja

//   return {
//     access_token: res.data.access_token,
//     refresh_token: res.data.refresh_token,
//   };
// };

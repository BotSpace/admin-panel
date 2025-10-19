import NextAuth from "next-auth";

export type Role = "admin" | "user" | "moderator";
export type Lang = "uz" | "en" | "ru" | "jp";

export interface User {
  refresh: string;
  access: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  accessTokenExpires: number;
  role: Role;
  avatar: string | null;
  lang: Lang;
  id: string;
}

export interface AuthSession extends User {}

declare module "next-auth" {
  interface User extends AuthSession {}
  interface Session {
    user: User;
  }
}

// Extend the default NextAuth JWT
declare module "next-auth/jwt" {
  interface JWT extends AuthSession {}
}

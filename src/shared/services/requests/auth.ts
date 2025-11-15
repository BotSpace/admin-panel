import { LoginResponse } from "@/features/auth/types/login";
import { GetMeResponse } from "@/features/auth/types/get-me";
import {
  UserUpdateRequest,
  UserUpdateResponse,
} from "@/features/auth/types/profile";
import { instance, instanceAuth } from "../instance";
import { Session } from "next-auth";
import { AxiosResponse } from "axios";

// Token yangilash funksiyasi
export async function RefreshAccessToken(token: Session["user"]) {
  try {
    // Refresh token orqali yangi access token olish
    const response = await instance.post("/auth/token/refresh/", {
      refresh: token.refresh,
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      access: refreshedTokens.access,
      accessTokenExpires: Date.now() + 5 * 60 * 1000, // Yangi access token muddati
      refresh: refreshedTokens.refresh ?? token.refresh, // Refresh tokenni yangilash
    };
  } catch (error) {
    console.error("Access token yangilanmadi", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Bot code bilan login qilish
export async function Login({
  code,
}: {
  code: string;
}): Promise<AxiosResponse<LoginResponse>> {
  // Refresh token orqali yangi access token olish
  return await instance.post<LoginResponse>("/authbot/login/", {
    code,
  });
}

// User profilni olish

export async function GetMe({
  access,
}: {
  access: string;
}): Promise<GetMeResponse | null> {
  try {
    // Refresh token orqali yangi access token olish
    const { data }: { data: GetMeResponse } = await instance.get("/auth/me/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return data;
  } catch {
    return null;
  }
}

// User profilni yangilash
export async function UpdateProfile(
  data: UserUpdateRequest
): Promise<AxiosResponse<UserUpdateResponse>> {
  return await instanceAuth.patch<UserUpdateResponse>(
    "/auth/user-update/",
    data
  );
}

// Parolni o'zgartirish
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  status: boolean;
  message?: string;
}

export async function ChangePassword(
  data: ChangePasswordRequest
): Promise<AxiosResponse<ChangePasswordResponse>> {
  return await instanceAuth.post<ChangePasswordResponse>(
    "/auth/change-password/",
    data
  );
}

import { instance } from "../instance";
import { Session } from "next-auth";

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

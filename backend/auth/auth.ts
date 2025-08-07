import { authHandler } from "encore.dev/auth";
import { Header, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

const googleClientId = secret("GoogleClientId");

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  email: string;
  name: string;
  picture: string;
}

async function verifyGoogleToken(token: string): Promise<AuthData> {
  try {
    // Verify the Google ID token
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    
    if (!response.ok) {
      throw new Error("Invalid token");
    }

    const payload = await response.json();

    // Verify the audience (client ID)
    if (payload.aud !== googleClientId()) {
      throw new Error("Invalid audience");
    }

    // Check if token is expired
    if (payload.exp < Date.now() / 1000) {
      throw new Error("Token expired");
    }

    return {
      userID: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    throw new Error(`Token verification failed: ${error}`);
  }
}

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const token = params.authorization?.replace("Bearer ", "");
    
    if (!token) {
      throw APIError.unauthenticated("missing authorization token");
    }

    try {
      return await verifyGoogleToken(token);
    } catch (error) {
      throw APIError.unauthenticated("invalid token", error);
    }
  }
);

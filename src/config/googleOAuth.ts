import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../utils/ApiError";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export const googleOAuth = async (code: string) => {
  const { tokens } = await client.getToken(code);
  const idToken = tokens.id_token;

  if (!idToken) {
    throw new ApiError(400, "Failed to get ID token from Google");
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(400, "Invalid Google Token");
  }

  return payload;
};

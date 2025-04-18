import { SignJWT, importPKCS8 } from "jose";

import { env } from '$env/dynamic/private';

const {
APPLE_CLIENT_ID,
APPLE_TEAM_ID,
APPLE_KEY_ID,
APPLE_PRIVATE_KEY,
} = env;

export async function generateAppleClientSecret() {
  const privateKey = APPLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const key = await importPKCS8(privateKey, "ES256");

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: APPLE_KEY_ID })
    .setIssuer(APPLE_TEAM_ID)
    .setAudience("https://appleid.apple.com")
    .setSubject(APPLE_CLIENT_ID)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

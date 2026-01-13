import crypto from "crypto";

export function generateToken(): string {
  return crypto.randomBytes(40).toString("hex");
}
import { OrderedGame } from "./OrderedGame";
import bcrypt from "bcrypt";

export const doesOrderRelateToUser = async (
  orderId: number,
  userId: number
) => {
  const result = await OrderedGame.query()
    .where("orderId", orderId)
    .where("userId", userId);
  return !!result.length;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
export const checkPassword = (password: string, hash: string) => {
  if (!password || !hash) return false;
  return bcrypt.compareSync(password, hash);
};

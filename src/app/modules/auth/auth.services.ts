import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;
//   const isUserExists = await User.findOne({ email });

//   if (!isUserExists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exists");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password!,
//     isUserExists.password!
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }

//   // const jwtPayload = {
//   //   email: isUserExists.email,
//   //   role: isUserExists.role,
//   //   id: isUserExists._id,
//   // };

//   // const accessToken = generateToken(
//   //   jwtPayload,
//   //   envVars.JWT_ACCESS_SECRET,
//   //   envVars.JWT_ACCESS_EXPIRES
//   // );

//   // const refreshToken = generateToken(
//   //   jwtPayload,
//   //   envVars.JWT_REFRESH_SECRET,
//   //   envVars.JWT_REFRESH_EXPIRES
//   // );

//   const userTokens = createUserTokens(isUserExists);

//   const { password: pass, ...rest } = isUserExists.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

// const resetPassword = async (
//   oldPassword: string,
//   newPassword: string,
//   decodedToken: JwtPayload
// ) => {
//   const user = await User.findById(decodedToken.userId);

//   const isOldPasswordMatch = await bcryptjs.compare(
//     oldPassword,
//     user!.password as string
//   );

//   if (!isOldPasswordMatch) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
//   }

//   user!.password = await bcryptjs.hash(
//     newPassword,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );

//   user!.save();
// };
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  console.log("Decoded userId:", decodedToken.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.save();
};
export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
};

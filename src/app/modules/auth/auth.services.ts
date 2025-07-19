import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exists");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password!,
    isUserExists.password!
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = {
    email: isUserExists.email,
    role: isUserExists.role,
    id: isUserExists._id,
  };

  // const accessToken = jwt.sign(jwtPayload, "secret", {
  //   expiresIn: "1d",
  // });
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  return accessToken;
};

export const AuthServices = {
  credentialsLogin,
};

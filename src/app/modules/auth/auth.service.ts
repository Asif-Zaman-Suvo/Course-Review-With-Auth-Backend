import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { TUser } from '../user/user.interface';
import AppError from '../../errors/appError';
import { TJwtPayload, TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const registerUserIntoDB = async (payload: TUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This user is already registered. Please use a different email!',
    );
  }
  const result = await User.create(payload);
  return result;
};

const loginUserService = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByUsername(payload.username);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  //create token and sent to the  client
  const jwtPayload: TJwtPayload = {
    _id: user?._id,
    email: user.email,
    role: user.role,
  };

  const token = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_EXPIRES_IN as string,
  );

  return {
    user,
    token,
  };
};

const changePassword = async (
  userData: JwtPayload | undefined,
  payload: { currentPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.currentPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUND),
  );

  await User.findOneAndUpdate(
    {
      username: userData?.username,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
    },
  );

  return user;
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserService,
  changePassword,
};

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { CategoryServices } from './category.service';
import sendResponse from '../../utils/sendResponse';
import { TUserRequest } from '../auth/auth.interface';

const createCategory = catchAsync(async (req: TUserRequest, res) => {
  const result = await CategoryServices.createCategoryIntoDB(
    req.user,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result.toObject({ versionKey: false }),
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoryFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});
export const CategoryControllers = {
  createCategory,
  getAllCategories,
};

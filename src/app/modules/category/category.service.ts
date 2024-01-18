import { TJwtPayload } from '../auth/auth.interface';
import { TCategory } from './category.interface';
import { Category } from './category.model';

//create a new category method
const createCategoryIntoDB = async (
  user: TJwtPayload,
  categoryData: TCategory,
) => {
  const result = await Category.create({
    ...categoryData,
    createdBy: user?._id,
  });

  return result;
};

//Get category method
const getAllCategoryFromDB = async () => {
  const result = await Category.find().populate(
    'createdBy',
    '_id username email role',
  );
  return { categories: result };
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
};

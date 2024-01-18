import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { createCategoryValidationSchema } from './category.validator';
import { CategoryControllers } from './category.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get('/', CategoryControllers.getAllCategories);

export const CategoryRoutes = router;

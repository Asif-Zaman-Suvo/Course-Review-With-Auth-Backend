import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { createCourseReviewValidatorSchema } from './review.validator';
import { ReviewController } from './review.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(createCourseReviewValidatorSchema),
  ReviewController.createCourseReview,
);

export const ReviewRoutes = router;

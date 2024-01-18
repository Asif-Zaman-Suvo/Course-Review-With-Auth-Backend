import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import {
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './course.validator';
import { CourseControllers } from './course.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/courses',
  auth(USER_ROLE.admin),
  validateRequest(createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/courses', CourseControllers.getAllCourses);
router.get(
  '/courses/:courseId/reviews',
  CourseControllers.getSingleCourseWithReviews,
);

router.get(
  '/course/best',
  CourseControllers.getBestCourseBasedOnAverageReviews,
);

router.put(
  '/courses/:courseId',
  auth(USER_ROLE.admin),
  validateRequest(updateCourseValidationSchema),
  CourseControllers.updatedSingleCourse,
);

export const CourseRoutes = router;

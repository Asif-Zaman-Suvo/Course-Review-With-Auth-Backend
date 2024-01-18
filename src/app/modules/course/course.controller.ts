import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';
import sendResponse from '../../utils/sendResponse';
import { QueryParams } from '../../interface/queryParams';
import { Course } from './course.model';
import { TUserRequest } from '../auth/auth.interface';

const createCourse = catchAsync(async (req: TUserRequest, res) => {
  const result = await CourseServices.createCourseIntoDB(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course is created succesfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: TUserRequest, res) => {
  const queryParams: QueryParams = req.query;
  const { page = 1, limit = 10 } = queryParams;
  const result = await CourseServices.getAllCourseFromDB(queryParams);
  const total = await Course.countDocuments(); // Count all documents without filters for total
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    meta: { page, limit, total },
    data: result,
  });
});

const getSingleCourseWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getCourseWithReviewsFromDB(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course with reviews retrieved successfully',
    data: result,
  });
});

const getBestCourseBasedOnAverageReviews = catchAsync(async (req, res) => {
  const result =
    await CourseServices.getBestCourseBasedOnAverageReviewsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

const updatedSingleCourse = catchAsync(async (req: TUserRequest, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.updateCourseIntoDB(
    req.user,
    courseId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourseWithReviews,
  getBestCourseBasedOnAverageReviews,
  updatedSingleCourse,
};

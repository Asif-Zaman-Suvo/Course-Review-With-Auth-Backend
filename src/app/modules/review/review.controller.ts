import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';
import { TUserRequest } from '../auth/auth.interface';

const createCourseReview = catchAsync(async (req: TUserRequest, res) => {
  const result = await ReviewServices.createCourseReviewIntoDB(
    req.user,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewController = {
  createCourseReview,
};

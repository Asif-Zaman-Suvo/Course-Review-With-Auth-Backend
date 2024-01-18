import { TJwtPayload } from '../auth/auth.interface';
import { TReview } from './review.interface';
import { Review } from './review.model';

const createCourseReviewIntoDB = async (
  user: TJwtPayload,
  payload: TReview,
) => {
  const result = await Review.create({
    ...payload,
    createdBy: user?._id,
  });
  return result.populate('createdBy', '-createdAt -updatedAt');
};

export const ReviewServices = {
  createCourseReviewIntoDB,
};

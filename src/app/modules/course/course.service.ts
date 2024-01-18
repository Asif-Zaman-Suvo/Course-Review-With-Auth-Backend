import mongoose from 'mongoose';
import { Review } from '../review/review.model';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { QueryParams, SortOrder } from '../../interface/queryParams';
import { TJwtPayload } from '../auth/auth.interface';

//create a new course method
const createCourseIntoDB = async (user: TJwtPayload, courseData: TCourse) => {
  const result = await Course.create({ ...courseData, createdBy: user?._id });
  return result;
};

const getAllCourseFromDB = async (queryParams: QueryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'startDate',
    sortOrder = 'asc',
    minPrice = 0,
    maxPrice = Number.MAX_VALUE,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = queryParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};
  if (minPrice || maxPrice) {
    filter.price = { $gte: minPrice, $lte: maxPrice };
  }
  if (tags) {
    filter['tags.name'] = tags;
  }
  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }
  if (language) {
    filter.language = language;
  }
  if (provider) {
    filter.provider = provider;
  }
  if (durationInWeeks) {
    filter.durationInWeeks = durationInWeeks;
  }
  if (level) {
    filter['details.level'] = level;
  }
  const sort: { [key: string]: SortOrder } = {};
  sort[sortBy] = sortOrder;

  const result = await Course.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('createdBy', '-createdAt -updatedAt');
  return result;
};

//
const getCourseWithReviewsFromDB = async (courseId: string) => {
  const course = await Course.findById(courseId).populate(
    'createdBy',
    '-createdAt -updatedAt',
  );
  const reviews = await Review.find({ courseId }, { _id: 0 }).populate(
    'createdBy',
    '-createdAt -updatedAt',
  );
  return { course, reviews };
};

const getBestCourseBasedOnAverageReviewsFromDB = async () => {
  const result = await Review.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 1,
    },
  ]);
  if (result.length === 0) {
    return null;
  } else {
    const bestCourseData = await Course.findById(result[0]._id).populate(
      'createdBy',
      '-createdAt -updatedAt',
    );
    return {
      course: bestCourseData,
      averageRating: result[0].averageRating.toFixed(1),
      reviewCount: result[0].reviewCount,
    };
  }
};

const updateCourseIntoDB = async (
  user: TJwtPayload,
  courseId: string,
  payload: Partial<TCourse>,
) => {
  const { tags, details, ...courseRemainingData } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const updatedCourseInfo = await Course.findByIdAndUpdate(
      courseId,
      { ...courseRemainingData, createdBy: user?._id },
      {
        new: true,
        runValidators: true,
      },
    ).populate('createdBy', '-createdAt -updatedAt');
    if (!updatedCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
    if (tags && tags.length > 0) {
      const deletedTagsName = tags
        .filter((el) => el.name && el.isDeleted)
        .map((el) => el.name);

      const deletedTags = await Course.findByIdAndUpdate(courseId, {
        $pull: { tags: { name: { $in: deletedTagsName } } },
      });
      if (!deletedTags) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
      const newTags = tags?.filter((el) => el.name && !el.isDeleted);
      const newTagsName = await Course.findByIdAndUpdate(courseId, {
        $addToSet: { tags: { $each: newTags } },
      });
      if (!newTagsName) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }
    if (details) {
      await Course.findByIdAndUpdate(
        courseId,
        { $set: { 'details.level': details.level } },
        { session },
      );
    }
    await session.commitTransaction();
    await session.endSession();
    const result = await Course.findById(courseId)
      .populate('tags.name')
      .populate('createdBy', '-createdAt -updatedAt');
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getCourseWithReviewsFromDB,
  getBestCourseBasedOnAverageReviewsFromDB,
  updateCourseIntoDB,
};

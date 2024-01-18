/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { TCourse, TCourseDetails, TTag } from './course.interface';

const tagSchema = new Schema<TTag>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  {
    _id: false,
  },
);

const courseDetailsSchema = new Schema<TCourseDetails>({
  level: { type: String, required: true },
  description: { type: String, required: true },
});

const courseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    price: { type: Number, required: true },
    tags: { type: [tagSchema], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    details: { type: courseDetailsSchema, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret.id;
        delete ret.__v;
        ret.tags.forEach((tag: { _id: any }) => delete tag._id);
        // eslint-disable-next-line no-unused-expressions
        ret.details && delete ret.details._id;
        return ret;
      },
    },
  },
);

courseSchema.virtual('durationInWeeks').get(function () {
  // Calculate durationInWeeks
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  const durationInWeeks = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );
  return durationInWeeks;
});

export const Course = model<TCourse>('Course', courseSchema);

import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const categoryNameSchema = new Schema<TCategory>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },

  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Category = model<TCategory>('Category', categoryNameSchema);

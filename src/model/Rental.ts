import { Document, Model, model, Schema } from 'mongoose';
import { Joi } from 'utils/validation';
import { ObjectId } from 'mongodb';
import moment from 'moment';

export type Rental = {
  _id: string;
  customer: {
    name: string;
    isGold?: boolean;
    phone: string;
  };
  movie: {
    title: string;
    dailyRentalRate: number;
  };
  dateOut: Date;
  dateReturned?: Date;
  rentalFee?: number;
};

type RentalMethods = {
  return: () => void;
};

interface RentalModel extends Model<Rental, {}, RentalMethods> {
  lookup(customerId: ObjectId, movieId: ObjectId): RentalDocument;
}

export type RentalDocument = Document<unknown, {}, Rental> &
  Omit<Rental & Required<{ _id: string }>, 'return'> &
  RentalMethods;

export type RequestRental = {
  customerId: ObjectId;
  movieId: ObjectId;
};

const rentalSchema = new Schema<Rental, RentalModel, RentalMethods>({
  customer: {
    type: new Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.statics.lookup = async function (
  customerId: ObjectId,
  movieId: ObjectId
) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

export const Rental = model<Rental, RentalModel>('Rental', rentalSchema);

export const validateRental = (rental: RequestRental) => {
  const schema = Joi.object<RequestRental>({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
};

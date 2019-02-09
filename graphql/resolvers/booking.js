const { dateToString } = require('../../helpers/date');

const Event = require('../../models/Event');
const Booking = require('../../models/Booking');

const DUMMYID = '5c5ed715126ba91b0c79f397';

module.exports = {
   bookings: async () => {
      try {
         const prePopulate = [
            {
               path: 'user',
               select: 'email',
            },
            {
               path: 'event',
               select: 'title description date price',
               populate: {
                  path: 'creator',
                  select: 'email'
               }
            }
         ];

         const bookings = await Booking
            .find()
            .populate(prePopulate)
            .exec();
         return bookings.map(booking => {
            return {
               ...booking._doc,
               createdAt: dateToString(booking.createdAt),
               updatedAt: dateToString(booking.updatedAt),
               event: {
                  ...booking.event._doc,
                  date: dateToString(booking.event.date)
               }
            }
         });
      }
      catch (error) {
         return error;
      }
   },
   bookEvent: async args => {
      try {
         const event = await Event.findOne({ _id: args.eventId });
         const booking = new Booking({
            user: DUMMYID,
            event: event
         });

         const bookingData = await booking.save();

         return {
            ...bookingData._doc,
            createdAt: dateToString(bookingData.createdAt),
            updatedAt: dateToString(bookingData.updatedAt)
         };


      }
      catch (error) {
         return error;
      }
   },
   cancelBooking: async args => {
      try {
         const booking = await Booking
            .findById(args.bookingId)
            .populate({
               path: 'event',
               populate: {
                  path: 'creator',
                  select: 'email'
               }
            });
         const event = booking.event;
         await Booking.deleteOne({ _id: args.bookingId});
         
         return event;
      }
      catch (error) {
         return error;
      }
   }
}
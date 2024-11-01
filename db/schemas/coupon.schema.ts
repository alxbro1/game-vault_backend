import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  date,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

export const coupons = pgTable('coupons', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  couponCode: varchar('code', { length: 50 }).unique().notNull(),
  discountPercentage: integer('discount_percentage').notNull(),
  expirationDate: date('expiration_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;

export const insertCouponSchema = createInsertSchema(coupons, {
  id: (schema) => schema.id,
  couponCode: (schema) => schema.couponCode,
  discountPercentage: (schema) => schema.discountPercentage,
  expirationDate: (schema) =>
    schema.expirationDate.refine((date) => dateRegex.test(date), {
      message: 'The date format must be YYYY/MM/DD',
    }),
  isActive: (schema) => schema.isActive,
});
export type CreateCouponDto = typeof coupons.$inferInsert;
export type CouponEntity = typeof coupons.$inferSelect;
export type InsertCouponSchema = z.infer<typeof insertCouponSchema>;

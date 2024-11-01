import { relations } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { orders } from './orders.schema';
import { pgEnum } from 'drizzle-orm/pg-core';
import { products } from './products.schema';

export const pgStatusEnum = pgEnum('status_enum', [
  'active',
  'inactive',
  'banned',
]);

export const pgRoleEnum = pgEnum('role_enum', ['client', 'admin']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  tokenConfirmation: text('tokenConfirmation'),
  password: text('password'),
  username: text('username'),
  description: text('description'),
  profileImage: text('profileImage')
    .default('default_profile_picture.png')
    .notNull(),
  bannerImage: text('bannerImage')
    .default(
      'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730401954/pk3ghbuuvspa1wro9y7k.jpg',
    )
    .notNull(),
  status: pgStatusEnum().default('active').notNull(),
  role: pgRoleEnum().default('client').notNull(),
  bannedReason: text('bannedReason'),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  wishlist: many(products),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users).omit({
  password: true,
});

export type CreateUserDto = z.infer<typeof insertUserSchema>;
export type UserEntity = typeof users.$inferInsert;

export type SelectUserDto = z.infer<typeof selectUserSchema>;

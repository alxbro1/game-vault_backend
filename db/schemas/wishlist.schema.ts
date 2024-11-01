import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { products } from './products.schema';

export const wishlistItems = pgTable('wishlist_item', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: text('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
});

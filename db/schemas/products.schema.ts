import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { categories } from './categories.schema';
import { cartAndProducts } from './cart_products.schema';
import z from 'zod';
import { users } from './users.schema';

export const productStatusEnum = pgEnum('active', ['active', 'inactive']);

export const productTypeEnum = pgEnum('type_product_enum', [
  'digital',
  'physical',
]);

export const products = pgTable('products', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  price: integer().notNull(),
  description: varchar({ length: 255 }).notNull(),
  type: productTypeEnum().notNull(),
  stock: integer().notNull(),
  name: varchar({ length: 100 }).notNull(),
  categoryId: varchar({ length: 255 })
    .references(() => categories.id)
    .notNull(),
  imageUrl: varchar({ length: 255 })
    .default('default_product_image.png')
    .notNull(),
  active: productStatusEnum().default('active').notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cart: many(cartAndProducts),
  wishlist: many(users),
}));

export const productInsertSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(3).max(100),
  price: (schema) => schema.price,
  description: (schema) => schema.description.max(255),
  type: (schema) => schema.type,
  stock: (schema) => schema.stock,
  categoryId: (schema) => schema.categoryId.uuid('ID must be UUID'),
});
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export type ProductEntity = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

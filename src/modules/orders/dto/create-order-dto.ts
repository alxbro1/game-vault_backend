import z from 'zod';

export const createOrderDto = z.object({
  userId: z.string(),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  amount: z.number(),
  shippingAddress: z.string()
});

export type CreateOrderDto = z.infer<typeof createOrderDto>;

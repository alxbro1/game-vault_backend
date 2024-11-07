import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { db } from '../../config/db';
import {
  orders,
  ordersDetails,
  SelectOrder,
  UpdateOrder,
} from '../../../db/schemas/orders.schema';
import { and, asc, eq, gte } from 'drizzle-orm';
import {
  PaginationByUserDto,
  PaginationCursorNumberDto,
} from '../../schemas/pagination.dto';
import { CreateOrderDto } from './dto/create-order-dto';
import { PaginatedOrdersDto } from './dto/paginated-orders.dto';

@Injectable()
export class ordersRepository {
  async create(data: CreateOrderDto) {
    let insertData: {
      userId: string;
      amount: number;
      shippingAddress?: string;
      shippingStatus?: 'pending';
    };
    if (data.shippingAddress)
      insertData = {
        shippingAddress: data.shippingAddress,
        userId: data.userId,
        amount: data.amount,
        shippingStatus: 'pending',
      };
    else
      insertData = {userId: data.userId, amount:data.amount}
    const order = (await db
      .insert(orders)
      .values(insertData)
      .returning()) as any;
    if (!order[0] || !order[0].id)
      throw new BadRequestException('Error creating order');
    const ordersDetailsObj = data.products.map((product) => {
      return {
        orderId: order[0].id,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      };
    });

    const orderDetails = await db
      .insert(ordersDetails)
      .values(ordersDetailsObj)
      .execute();

    if (!orderDetails) {
      throw new BadGatewayException('Error creating order details');
    }

    return order[0].id;
  }

  async updateToPayment(data: any) {
    const dbResponse = await db
      .update(orders)
      .set({
        mpOrderId: data.mpOrder,
        isPaid: data.paid,
        orderEstatus: data.status,
      })
      .where(eq(orders.id, data.order))
      .execute();
    console.log(dbResponse);
    return dbResponse;
  }

  async getOrdersByUser({
    userId,
    limit,
    cursor,
  }: PaginationByUserDto): Promise<PaginatedOrdersDto> {
    const where = [eq(orders.userId, userId)];

    if (cursor) where.push(gte(orders.id, cursor));

    const NEXT_CURSOR_ITEM = 1;

    const selectedOrders = await db.query.orders
      .findMany({
        where: and(...where),
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(orders.id),
      })
      .catch(() => {
        throw new BadRequestException('There are no more orders available');
      });
    let nextCursor: number | null = null;

    if (selectedOrders.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedOrders.length > limit) {
      nextCursor = selectedOrders.pop()!.id;
    }

    return {
      data: selectedOrders,
      nextCursor: String(nextCursor),
    };
  }

  async getOrderById(orderId: number) {
    const dbResponse = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        ordersDetails: {
          with: {
            product: true,
          },
        },
      },
    });
    return dbResponse;
  }

  async findAllAdmin({
    cursor,
    limit,
  }: PaginationCursorNumberDto): Promise<PaginatedOrdersDto> {
    let where: any = undefined;

    if (cursor) where = gte(orders.id, cursor);

    const NEXT_CURSOR_ITEM = 1;
    const selectedOrders = await db.query.orders
      .findMany({
        where,
        limit: limit + NEXT_CURSOR_ITEM,
        orderBy: asc(orders.id),
        with: {
          user: {
            columns: {
              id: true,
              email: true,
            },
          },
        },
      })
      .catch(() => {
        throw new BadRequestException('There are no more orders available');
      });

    let nextCursor: number | null = null;

    if (selectedOrders.length === 0)
      return {
        data: [],
        nextCursor,
      };

    if (selectedOrders.length > limit) {
      nextCursor = selectedOrders.pop()!.id;
    }

    return {
      data: selectedOrders,
      nextCursor: String(nextCursor),
    };
  }

  async update(id: SelectOrder['id'], data: UpdateOrder) {
    const dbResponse = await db
      .update(orders)
      .set(data)
      .where(eq(orders.id, id));

    return dbResponse;
  }
}

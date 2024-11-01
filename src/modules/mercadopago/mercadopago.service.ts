import { BadRequestException, Injectable } from '@nestjs/common';
import { mpClient } from '../../config/mercadopago.config';
import { Payment, Preference, PaymentRefund } from 'mercadopago';
import { HOST } from '../../config/enviroments.config';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { CouponService } from '../coupon/coupon.service';
import { SelectUserDto } from '../../../db/schemas/users.schema';

@Injectable()
export class MercadopagoService {
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private couponService: CouponService,
  ) {}

  async create(body: CreateMercadopagoDto, user: SelectUserDto) {
    if (!user?.id) {
      throw new BadRequestException('User not found');
    }

    const productsArr = await this.productsService.findManyByIds(
      body.products.map(({ id }) => id),
    );

    let amount = 0;
    let discountAmount = 0;
    let coupon: any;
    const couponCode = body.couponCode;

    if (couponCode) {
      coupon = await this.couponService.findOneByCode(couponCode);
      if (!coupon) {
        throw new BadRequestException(
          `Coupon with code ${couponCode} not Found`,
        );
      }

      if (!coupon.isActive) {
        throw new BadRequestException(
          `Coupon with code ${couponCode} is not Active`,
        );
      }

      const currentDate = new Date();
      if (currentDate > new Date(coupon.expirationDate)) {
        throw new BadRequestException(
          `Coupon with code ${couponCode} has expired`,
        );
      }

      discountAmount = (amount * coupon.discountPercentage) / 100;
    }

    const productsForPreference = await Promise.all(
      productsArr.map(async (product) => {
        const prodReq = body.products.find(({ id }) => id === product.id);
        if (!prodReq) {
          throw new BadRequestException(
            `Product by id equal ${product.id} not found`,
          );
        }
        if (!prodReq.quantity) {
          throw new BadRequestException(
            `Quantity of product by id equal ${product.id} is required`,
          );
        }
        if (!product) {
          throw new BadRequestException(
            `Product by id equal ${prodReq.id} not found`,
          );
        }
        if (product.stock < prodReq.quantity) {
          throw new BadRequestException(
            `Product by id equal ${product.id} out of stock`,
          );
        }

        let unitPrice = product.price;
        console.log(`Original price of product ${product.id}: ${unitPrice}`);

        if (couponCode && coupon && coupon.isActive) {
          const discountAmount = (unitPrice * coupon.discountPercentage) / 100;
          unitPrice -= discountAmount;
          console.log(
            `New price of product ${product.id} after discount: ${unitPrice}`,
          );
        }

        amount += unitPrice * prodReq.quantity;
        console.log(
          `Updated amount after adding product ${product.id}: ${amount}`,
        );

        return {
          id: product.id,
          title: product.name,
          quantity: prodReq.quantity,
          unit_price: unitPrice,
          currency_id: 'ARS',
          category_id: product.categoryId,
        };
      }),
    );

    if (couponCode) {
      await this.couponService.changeStatus(coupon.id, false);
      console.log(`Coupon with ID: ${coupon.id} has been disabled`);
    }

    const totalAfterDiscount = Math.round(amount - discountAmount);

    const productForOrder = productsArr.map((product) => {
      const prodReq = body.products.find(({ id }) => id === product.id) as any;
      return {
        productId: product.id,
        quantity: prodReq.quantity,
        price: product.price,
      };
    });

    const orderId = await this.ordersService.create({
      userId: user.id,
      products: productForOrder,
      amount: totalAfterDiscount,
    });
    console.log('Order created with ID:', orderId);

    const orderBody = {
      body: {
        items: productsForPreference,
        payer: {
          email: user.email,
          id: user.id,
        },
        notification_url: `${HOST}/mercadopago/webhook`,
        metadata: {
          userId: user.id,
          email: user.email,
          orderId,
        },
      },
    };

    const preference = await new Preference(mpClient).create(orderBody);

    return { url: preference.init_point, statusCode: 201 };
  }

  async webhook(body: any) {
    if (body.data) {
      const payment: any = await new Payment(mpClient).get(body.data);
      console.log('Payment received:', payment);

      const products = payment.additional_info.items;
      const metadata = payment.metadata;

      if (payment.status == 'approved') {
        console.log('Payment approved:', payment.id);

        const productsData = await this.productsService.findManyByIds(
          products.map((product: { id: any }) => product.id),
        );

        products.forEach(async (product: { id: any; quantity: any }) => {
          const productDb = productsData.find((prod) => prod.id === product.id);
          if (!productDb || productDb.stock < product.quantity) {
            try {
              await new PaymentRefund(mpClient).create({
                payment_id: payment.id,
                body: {},
              });

              const updatePaymentObject = {
                mpOrder: payment.order.id,
                paid: false,
                status: 'refund',
                order: metadata.order_id,
              };

              await this.ordersService.updateToPayment(updatePaymentObject);

              throw new BadRequestException('Insufficient stock');
            } catch (error) {
              console.error('Error processing refund:', error);
            }
          }
        });

        products.forEach(async (product: { id: any; quantity: any }) => {
          const productDb = productsData.find((prod) => prod.id === product.id);
          if (productDb) {
            await this.productsService.updateStock(
              -product.quantity,
              product.id,
            );
          }
        });

        const updatePaymentObject = {
          mpOrder: payment.order.id,
          paid: true,
          status: 'paid',
          order: metadata.order_id,
        };

        const dbResponse =
          await this.ordersService.updateToPayment(updatePaymentObject);
        console.log('Payment status updated to "paid":', dbResponse);

        return dbResponse;
      }

      if (payment.status === 'rejected') {
        console.log('Payment rejected:', payment.id);

        const updatePaymentObject = {
          mpOrder: payment.order.id,
          paid: false,
          status: 'cancelled',
          order: metadata.order_id,
        };

        return await this.ordersService.updateToPayment(updatePaymentObject);
      }
    }
  }
}

import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { OrdersService } from '../orders/orders.service';
import { ordersRepository } from '../orders/orders.repository';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { CouponService } from '../coupon/coupon.service';
import { CouponRepository } from '../coupon/coupon.repository';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [MercadopagoController],
  providers: [
    MercadopagoService,
    OrdersService,
    ordersRepository,
    UsersService,
    ProductsService,
    CouponService,
    CouponRepository,
  ],
})
export class MercadopagoModule {}
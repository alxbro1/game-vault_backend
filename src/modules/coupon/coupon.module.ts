import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepository } from './coupon.repository';

@Module({
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
  exports:[CouponService, CouponRepository]
})
export class CouponModule {}

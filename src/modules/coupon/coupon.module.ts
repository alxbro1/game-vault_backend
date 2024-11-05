import { Module } from '@nestjs/common';

import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepository } from './coupon.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
  exports: [CouponService, CouponRepository],
})
export class CouponModule {}

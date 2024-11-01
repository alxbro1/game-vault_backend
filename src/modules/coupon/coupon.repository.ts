import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { coupons, CreateCouponDto } from '../../../db/schemas/coupon.schema';
import { db } from '../../config/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class CouponRepository {
  async findAllCoupons(): Promise<CreateCouponDto[]> {
    const couponsList = await db.select().from(coupons).execute();
    return couponsList;
  }
  async createDiscountCoupon(
    couponData: CreateCouponDto,
  ): Promise<CreateCouponDto[]> {
    try {
      const coupon = await db
        .insert(coupons)
        .values(couponData)
        .returning()
        .execute();

      if (!coupon) {
        throw new BadRequestException('Error creating coupon');
      }
      return coupon;
    } catch (error) {
      throw new BadRequestException('Error creating coupon');
    }
  }

  async validateCouponExpired(id: string): Promise<{ message: string }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();
    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }
    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }
    const isExpired = new Date() > new Date(coupon.expirationDate);
    if (isExpired) {
      throw new BadRequestException('Coupon is expired');
    }
    return { message: 'Validation successful' };
  }

  async findOneById(id: string): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async deleteDiscountCoupon(id: string): Promise<{ message: string }> {
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .limit(1)
      .execute();

    if (!coupon.length) {
      throw new NotFoundException('Coupon not found');
    }

    await db.delete(coupons).where(eq(coupons.id, id)).execute();

    return { message: 'Coupon successfully deleted' };
  }

  async updateDiscountPercentage(
    id: string,
    newDiscountPercentage: number,
  ): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await db
      .update(coupons)
      .set({ discountPercentage: newDiscountPercentage })
      .where(eq(coupons.id, id))
      .returning()
      .execute();

    return updatedCoupon[0];
  }

  async changeCouponStatusById(
    id: string,
    isActive: boolean,
  ): Promise<{ message: string }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }
    await db
      .update(coupons)
      .set({ isActive })
      .where(eq(coupons.id, id))
      .execute();

    const statusMessage = isActive ? 'activated' : 'deactivated';
    return { message: `Coupon has been ${statusMessage}` };
  }
  async findOneByCode(couponCode: string): Promise<CreateCouponDto> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, couponCode))
      .execute();

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }
  async changeActive(id: string): Promise<{ message: string }> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .execute();

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    const newStatus = !coupon.isActive;
    await db
      .update(coupons)
      .set({ isActive: newStatus })
      .where(eq(coupons.id, id))
      .execute();

    const statusMessage = newStatus ? 'activated' : 'deactivated';
    return { message: `Coupon has been ${statusMessage}` };
  }
}

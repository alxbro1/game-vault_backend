import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { InsertCouponSchema } from '../../../db/schemas/coupon.schema';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('coupons')
@ApiTags('Coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all coupons',
    content: {
      'application/json': {
        example: [
          {
            id: '1234-5678-abcd-efgh',
            couponCode: 'SAVE20',
            discountPercentage: 20,
            expirationDate: '2024-12-31',
            isActive: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupons not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupons not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async getAllCoupons() {
    return this.couponService.findAllCoupons();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiBody({
    description: 'Request body for creating a coupon',
    required: true,
    examples: {
      example1: {
        summary: 'Create Coupon Example',
        value: {
          couponCode: 'SAVE10',
          discountPercentage: 10,
          expirationDate: '2024-11-30',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Coupon created successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE10',
          discountPercentage: 10,
          expirationDate: '2024-11-30',
          isActive: true,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    content: {
      'application/json': {
        example: {
          message: 'Error creating coupon',
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    },
  })
  async create(@Body() couponData: InsertCouponSchema) {
    return this.couponService.createCoupon(couponData);
  }

  @Get('validate/:id')
  @ApiOperation({ summary: 'Validate a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon validated successfully',
    content: {
      'application/json': {
        example: 'Coupon Expired',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async validate(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.validateCoupon(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE10',
          discountPercentage: 10,
          expirationDate: '2024-11-30',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) couponCode: string) {
    return this.couponService.findOneBy(couponCode);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon deleted successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.deleteCoupon(id);
  }

  @Patch('update-discount/:id')
  @ApiOperation({ summary: 'Update discount percentage of a coupon' })
  @ApiBody({
    description: 'Request body to update the discount percentage',
    required: true,
    examples: {
      example1: {
        summary: 'Update Discount Example',
        value: {
          discountPercentage: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Discount percentage updated successfully',
    content: {
      'application/json': {
        example: {
          message: 'Discount percentage updated successfully',
          newDiscountPercentage: 15,
        },
      },
    },
  })
  async updateDiscount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('discountPercentage') discountPercentage: number,
  ) {
    return this.couponService.updateDiscountPercentage(id, discountPercentage);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Toggle coupon status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon status changed successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon status changed successfully',
        },
      },
    },
  })
  async changeCouponStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() isAdmin: boolean,
  ) {
    return this.couponService.changeStatus(id, isAdmin);
  }

  @Get('code/:couponCode')
  @ApiOperation({ summary: 'Get a coupon by coupon code' })
  @ApiResponse({
    status: 200,
    description: 'Coupon retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: '1234-5678-abcd-efgh',
          couponCode: 'SAVE20',
          discountPercentage: 20,
          expirationDate: '2024-12-31',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async findOneByCode(@Param('couponCode') couponCode: string) {
    return this.couponService.findOneByCode(couponCode);
  }

  @Patch('toggle-status/:id')
  @ApiOperation({ summary: 'Toggle coupon status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Coupon status toggled successfully',
    content: {
      'application/json': {
        example: {
          message: 'Coupon has been activated',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon not found',
    content: {
      'application/json': {
        example: {
          message: 'Coupon not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponService.toggleStatus(id);
  }
}

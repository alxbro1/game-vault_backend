import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-welcome-email')
  async sendWelcomeEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    try {
      await this.mailService.sendWelcomeMail(user);
      return { message: 'Welcome email sent successfully' };
    } catch (error) {
      return { message: 'Error sending welcome email', error };
    }
  }

  @Get('send-confirmation-email')
  async sendConfirmationEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
      confirmationLink: 'http://yourapplication.com/confirm?token=abc123',
    };

    try {
      await this.mailService.sendConfirmationMail(user);
      return { message: 'Confirmation email sent successfully' };
    } catch (error) {
      return { message: 'Error sending confirmation email', error };
    }
  }

  @Get('send-order-email')
  async sendOrderEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    const orderDetails = {
      orderId: '123456',
      items: 'Game A, Game B, Game C',
      total: 59.99,
    };

    try {
      await this.mailService.sendOrderMail(user, orderDetails);
      return { message: 'Order email sent successfully' };
    } catch (error) {
      return { message: 'Error sending order email', error };
    }
  }

  @Get('send-preparation')
  async sendPreparationMail(
    @Body() data: { user: { email: string; name: string }; orderId: string },
  ) {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    const orderDetails = {
      orderId: '123456',
      items: 'Game A, Game B, Game C',
      total: 59.99,
    };
    try {
      await this.mailService.sendPreparationMail(user, orderDetails.orderId);
      return { message: 'Preparation email sent successfully' };
    } catch (error) {
      return { message: 'Error sending preparation email', error };
    }
  }

  @Get('send-dispatched')
  async sendDispatchedMail(
    @Body()
    data: {
      user: { email: string; name: string };
      orderId: string;
      trackingNumber: string;
    },
  ) {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    const dispatch = {
      user: user,
      orderId: '12345',
      trackingNumber: '23423nidfnix',
    };
    try {
      await this.mailService.sendDispatchedMail(
        user,
        dispatch.orderId,
        dispatch.trackingNumber,
      );
      return { message: 'Dispatched order email sent successfully' };
    } catch (error) {
      return { message: 'Error sending dispatched email', error };
    }
  }

  @Get('send-on-the-way')
  async sendOnTheWayMail(
    @Body()
    data: {
      user: { email: string; name: string };
      orderId: string;
      trackingNumber: string;
    },
  ) {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    const dispatch = {
      user: user,
      orderId: '12345',
      trackingNumber: '23423nidfnix',
    };
    try {
      await this.mailService.sendOnTheWayMail(
        user,
        dispatch.orderId,
        dispatch.trackingNumber,
      );
      return { message: 'On the way order email sent successfully' };
    } catch (error) {
      return { message: 'Error sending on the way email', error };
    }
  }

  @Get('send-delivered')
  async sendDeliveredMail(
    @Body() data: { user: { email: string; name: string }; orderId: string },
  ) {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    const orderDetails = {
      orderId: '123456',
      items: 'Game A, Game B, Game C',
      total: 59.99,
    };
    try {
      await this.mailService.sendDeliveredMail(user, orderDetails.orderId);
      return { message: 'Delivered order email sent successfully' };
    } catch (error) {
      return { message: 'Error sending delivery email', error };
    }
  }

  @Get('verified-email/:token')
  async verifiedEmail(@Param('token') token: string) {}
  @Post('send-coupon')
  async sendCoupon(
    @Body()
    data: {
      emails: string[];
      coupons: {
        couponCode: string;
        discountPercentage: number;
        expirationDate: string;
      }[];
    },
  ) {
    const { emails, coupons } = data;

    if (!emails || !coupons || emails.length !== coupons.length) {
      return {
        message:
          'Invalid data provided. Ensure emails and coupons are provided in equal numbers.',
      };
    }

    try {
      for (let i = 0; i < emails.length; i++) {
        const user = { email: emails[i] };
        const coupon = coupons[i];

        await this.mailService.sendCouponMail(user, coupon);
      }

      return { message: 'All coupons sent successfully!' };
    } catch (error) {
      console.error('Error sending coupons:', error);
      return { message: 'Error sending some coupons', error };
    }
  }
}

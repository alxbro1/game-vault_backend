import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { AuthGuard } from '../../guards/auth.guard';
import { SelectUserDto } from '../../../db/schemas/users.schema';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() products: any,
    @Req() request: Request & { user: SelectUserDto },
  ) {
    return await this.mercadopagoService.create(products, request.user).then((res) => res);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    await this.mercadopagoService.webhook(body);
  }
}

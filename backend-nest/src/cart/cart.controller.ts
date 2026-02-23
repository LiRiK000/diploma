import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  async getCart(@CurrentUser('id') userId: string) {
    const data = await this.cartService.getCart(userId);
    return { status: 'success', data };
  }

  @Post('add')
  @ApiOperation({ summary: 'Добавить книгу в корзину' })
  async addToCart(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    const cartItem = await this.cartService.addToCart(userId, dto);
    return { status: 'success', data: { cartItem } };
  }

  @Patch('item/:id')
  @ApiOperation({ summary: 'Обновить количество в корзине' })
  async updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const data = await this.cartService.updateItem(userId, id, dto.quantity);
    return { status: 'success', data };
  }

  @Delete('item/:id')
  @ApiOperation({ summary: 'Удалить книгу из корзины' })
  async removeItem(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return await this.cartService.removeItem(userId, id);
  }

  @Get('total')
  @ApiOperation({ summary: 'Получить общее количество предметов' })
  async getTotal(@CurrentUser('id') userId: string) {
    return await this.cartService.getTotal(userId);
  }
}

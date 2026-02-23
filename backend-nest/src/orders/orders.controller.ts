import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConfirmPickupDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@CurrentUser('id') userId: string) {
    return this.ordersService.create(userId);
  }

  @Post('verify-code')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  async verify(
    @Body() dto: ConfirmPickupDto,
    @CurrentUser('id') librarianId: string,
  ) {
    return this.ordersService.verifyPickupCode(dto.pickupCode, librarianId);
  }

  @Get('stats')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  async getStats() {
    return this.ordersService.getAdminStats();
  }

  @Get('my-orders')
  async getAllMyOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get('all')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  async getAllOrders() {
    return this.ordersService.findAllForLibrarian();
  }

  @Patch(':id/return')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  async return(@Param('id') id: string) {
    return this.ordersService.returnOrder(id);
  }

  @Patch(':id/approve')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  async approve(@Param('id') id: string) {
    return this.ordersService.approveOrder(id);
  }

  @Patch(':id/reject')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  async reject(@Param('id') id: string) {
    return this.ordersService.rejectOrder(id);
  }

  @Patch(':id/confirm-receipt')
  async confirm(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.confirmReceipt(id, userId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.findOne(id, userId);
  }
}

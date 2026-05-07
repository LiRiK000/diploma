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
import { ConfirmPickupDto } from './dto/confirm-pickup.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from '@prisma/client';
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser('id') userId: string) {
    return this.ordersService.create(userId);
  }

  @Get('my')
  getMy(@CurrentUser('id') userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Post('return-by-code')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  returnByCode(@Body('code') code: string) {
    return this.ordersService.returnOrderByCode(code);
  }
  @Get('admin/all')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  getAllForAdmin() {
    return this.ordersService.findAllOrdersForLibrarian();
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: any) {
    return user.role === Role.LIBRARIAN
      ? this.ordersService.findOne(id)
      : this.ordersService.findOne(id, user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.cancelOrderByUser(id, userId);
  }

  @Patch(':id/confirm-receipt')
  confirm(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.confirmReceipt(id, userId);
  }

  @Patch(':id/approve')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  approve(@Param('id') id: string) {
    return this.ordersService.approveOrder(id);
  }

  @Patch(':id/reject')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  reject(@Param('id') id: string) {
    return this.ordersService.rejectOrder(id);
  }

  @Post('verify-code')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  verify(
    @Body() dto: ConfirmPickupDto,
    @CurrentUser('id') librarianId: string,
  ) {
    return this.ordersService.verifyPickupCode(dto.pickupCode, librarianId);
  }

  @Patch(':id/return')
  @Roles(Role.LIBRARIAN)
  @UseGuards(RolesGuard)
  return(@Param('id') id: string) {
    return this.ordersService.returnOrder(id);
  }
}

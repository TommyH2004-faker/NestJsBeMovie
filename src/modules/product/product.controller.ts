import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Param,
  Patch,
  PipeTransform,
  Post,
  Req,
  Scope,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../entity/Product';
import { CreateProductDto } from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Injectable({ scope: Scope.REQUEST })
export class ValidationPipe implements PipeTransform {
  // eslint-disable-next-line prettier/prettier
  constructor(@Inject(REQUEST) private readonly request: Request) {
  
  }

  transform(value: UpdateProductDto): UpdateProductDto {
    const id = this.request?.params?.id;
    const { name } = value;

    if (typeof name === 'string' && name.trim().toUpperCase() === 'SẢN PHẨM') {
      throw new BadRequestException(
        `Không được đặt tên sản phẩm là "SẢN PHẨM"${id ? ` (ID: ${id})` : ''}`,
      );
    }

    return value;
  }
}

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request & { user: string }): Promise<Product[]> {
    console.log(req.user);
    const user = await this.productService.findAll();
    if (!user) {
      throw new HttpException('Không tìm thấy sản phẩm', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.findOne(+id);
    if (!product) {
      throw new HttpException('Sản phẩm không tìm thấy', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Post('/create')
  create1(@Body() productData: CreateProductDto): Promise<Product> {
    return this.productService.create(productData);
  }

  @Post()
  create(@Body() productData: CreateProductDto): Promise<Product> {
    return this.productService.create(productData);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) productData: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productService.update(+id, productData);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<Product | null> {
    return this.productService.delete(+id);
  }
}


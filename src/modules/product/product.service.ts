import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../../entity/Product';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  create(productData: Partial<Product>) {
    const product = this.productRepository.create(productData);
    product.createdAt = new Date();
    product.updatedAt = new Date();
    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>) {
    productData.updatedAt = new Date();
    await this.productRepository.update(id, productData);
    return this.productRepository.findOneBy({ id });
  }

  async delete(id: number) {
    await this.productRepository.delete(id);
    return this.productRepository.findOneBy({ id });
  }
}

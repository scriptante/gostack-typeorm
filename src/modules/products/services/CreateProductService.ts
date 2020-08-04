import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const checkProductExists = await this.productsRepository.findByName(name);
    if (checkProductExists) {
      throw new AppError('this product already registred');
    }
    const createdProduct = await this.productsRepository.create({
      name,
      price,
      quantity,
    });
    return createdProduct;
  }
}

export default CreateProductService;

import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const createdProduct = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    const savedProduct = await this.ormRepository.save(createdProduct);
    return savedProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const existsProduct = await this.ormRepository.findOne({ where: { name } });
    return existsProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);
    const productsFound = this.ormRepository.findByIds(ids);
    return productsFound;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsToResponse: Array<Product> = [];
    for (let i = 0; i < products.length; i += 1) {
      const stockproduct = await this.ormRepository.findOne(products[i].id);
      if (!stockproduct) {
        throw new AppError('product not found');
      }
      const newQuantity = stockproduct.quantity - products[i].quantity;
      if (newQuantity < 0) {
        throw new AppError(`product ${stockproduct.name} out of stock`);
      }
      const product = await this.ormRepository.save({
        ...stockproduct,
        quantity: newQuantity,
      });
      productsToResponse.push({ ...product, quantity: products[i].quantity });
    }
    return productsToResponse;
  }
}

export default ProductsRepository;

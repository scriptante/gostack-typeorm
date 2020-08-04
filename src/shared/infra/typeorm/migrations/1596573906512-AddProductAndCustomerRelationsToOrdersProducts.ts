import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddProductAndCustomerRelationsToOrdersProducts1596573906512
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('orders_products', [
      new TableColumn({
        name: 'product_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'order_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
    await queryRunner.createForeignKeys('orders_products', [
      new TableForeignKey({
        name: 'orderProduct',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'orderProductOrder',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders_products', 'orderProduct');
    await queryRunner.dropForeignKey('orders_products', 'orderProductOrder');
    await queryRunner.dropColumn('appointments', 'product_id');
    await queryRunner.dropColumn('appointments', 'order_id');
  }
}

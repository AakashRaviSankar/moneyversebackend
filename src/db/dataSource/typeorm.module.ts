import { DataSource, DataSourceOptions } from 'typeorm';
import { getDataFromJsonFile } from 'common/utils/fileUtils';

const environment = process.env.NODE_ENV || 'local';
// const configuration = getDataFromJsonFile('src/config/config.json');

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'moneyverse-aakashsankar.g.aivencloud.com',
  port: 22032,
  username: 'avnadmin',
  password: 'AVNS_jIf0OCxXvkSN_q9GBo7',
  database: 'earneasy',
  entities: ['dist/**/*.entity.js'],
  migrations: ['src/db/migrations/*{.ts,.js}'],
  // cli: {
  //   migrationsDir: 'src/db/migrations',
  // },
  synchronize: true,
  logging: true,
  extra: {
    authPlugin: 'mysql_native_password',
  },
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();
export default dataSource;

import { DataSource, DataSourceOptions } from 'typeorm';
import { getDataFromJsonFile } from 'common/utils/fileUtils';

const environment = process.env.NODE_ENV || 'local';
const configuration = getDataFromJsonFile('src/config/config.json');

export const dataSourceOptions: DataSourceOptions = {
  ...configuration[environment],
};
const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();
export default dataSource;

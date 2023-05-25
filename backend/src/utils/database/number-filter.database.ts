import { SelectQueryBuilder } from 'typeorm';

const processMinMaxFilter = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  columnName: string,
  key: string,
  value: any,
  option: Record<string, any>,
): void => {
  if (key.startsWith('min')) {
    queryBuilder.andWhere(
      `CAST(${columnName} AS INTEGER) >= CAST(:${key} AS INTEGER)`,
      {
        [key]: value,
      },
    );
  } else if (key.startsWith('max')) {
    queryBuilder.andWhere(
      `CAST(${columnName} AS INTEGER) <= CAST(:${key} AS INTEGER)`,
      {
        [key]: value,
      },
    );
  }

  const fieldName = key.replace(/^(min_|max_)/, '');
  if (!option[fieldName]) {
    option[fieldName] = {};
  }
  option[fieldName][key.startsWith('min') ? 'min' : 'max'] = value;
};

export const processFilter = <T>(
  filterKey: string,
  filterValue: any,
  option: Record<string, any>,
  filterList,
  queryBuilder: SelectQueryBuilder<T>,
): void => {
  const columnName = filterList[filterKey];
  if (columnName && filterValue !== undefined && filterValue !== '') {
    if (filterKey === 'rooms') {
      const rooms = Array.isArray(filterValue)
        ? filterValue.map(Number)
        : typeof filterValue === 'string'
        ? filterValue.split(',').map(Number)
        : [Number(filterValue)];
      queryBuilder.andWhere(`${columnName} IN (:...rooms)`, { rooms });
      option[filterKey] = rooms;
    } else {
      const numericValue = isNaN(filterValue)
        ? filterValue
        : Number(filterValue);
      processMinMaxFilter(
        queryBuilder,
        columnName,
        filterKey,
        numericValue,
        option,
      );
    }
  }
};

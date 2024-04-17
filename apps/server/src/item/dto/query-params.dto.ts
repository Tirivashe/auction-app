export class QueryParamsDto {
  filter?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

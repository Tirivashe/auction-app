export class QueryParamsDto {
  name?: string;
  description?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export type DefaultDelegates =
  | 'create'
  | 'createMany'
  | 'findUnique'
  | 'findMany'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'count';

export type PrismaSelectionType = Record<string, boolean>;

export type PaginationMeta = {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: any;
  nextPage: any;
};
export type PaginatedType<T> = [T[], PaginationMeta];

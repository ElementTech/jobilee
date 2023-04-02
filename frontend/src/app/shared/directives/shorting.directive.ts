
export type SortColumn = any | '';
export type SortDirection = 'asc' | 'desc' | '';
export const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}



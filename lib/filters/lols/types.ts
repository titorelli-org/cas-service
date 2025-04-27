export type UseridRecord = {
  id: number;
  tgUserId: number;
  createdAt: string;
  updatedAt: string;
};

export type BanListItem = {
  id: string;
  description: string;
  format: BanListItemFormat;
};

export type BanListItemFormat = {
  json?: string;
  csv: string;
  plain: string;
};

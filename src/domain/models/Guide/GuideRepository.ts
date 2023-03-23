import type { Guide } from '@/domain/models/Guide/Guide';

interface GuideRepository {
  get(): Promise<Guide>;
  getLastUpdatedTimestamp(): Promise<Date>;
}

export type { GuideRepository };

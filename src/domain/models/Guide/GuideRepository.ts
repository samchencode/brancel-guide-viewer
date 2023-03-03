import type { Guide } from '@/domain/models/Guide/Guide';

interface GuideRepository {
  get(): Promise<Guide>;
}

export type { GuideRepository };

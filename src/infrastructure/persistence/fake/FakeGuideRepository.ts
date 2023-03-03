import type { GuideParser, GuideRepository } from '@/domain/models/Guide';
import { Guide } from '@/domain/models/Guide';
import { stubGuide } from '@/infrastructure/persistence/fake/stubGuide';

class FakeGuideRepository implements GuideRepository {
  constructor(private readonly guideParser: GuideParser) {}

  async get() {
    return new Guide(stubGuide, this.guideParser);
  }
}

export { FakeGuideRepository };

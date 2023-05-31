import type { GuideRepository } from '@/domain/models/Guide';
import type {
  TableOfContents,
  TableOfContentsRepository,
} from '@/domain/models/TableOfContents';

class GuideTableOfContentsRepository implements TableOfContentsRepository {
  private toc?: TableOfContents;

  constructor(private readonly guideRepository: GuideRepository) {}

  async get(): Promise<TableOfContents> {
    if (!this.toc) {
      const guide = await this.guideRepository.get();
      this.toc = await guide.getTableOfContents();
    }
    return this.toc;
  }
}

export { GuideTableOfContentsRepository };

import type { TableOfContentsRepository } from '@/domain/models/TableOfContents';

class GetTableOfContentsAction {
  constructor(
    private readonly tableOfContentsRepository: TableOfContentsRepository
  ) {}

  async execute() {
    return this.tableOfContentsRepository.get();
  }

  static $inject = ['tableOfContentsRepository'];
}

export { GetTableOfContentsAction };

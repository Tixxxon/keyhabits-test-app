import { SummaryModel } from '@/database/models/summary.model';

export class MainService {
  constructor(private readonly summaryRepository: SummaryModel) {}

  getSummary() {
    return this.summaryRepository.getSummary();
  }
}

import { SummaryModel } from '@/database/models/summary.model';
import { Express, Request, Response, Router } from 'express';
import { MainService } from './main.service';

export function MainController(app: Express) {
  const summaryRepository = SummaryModel.getInstance();

  const mainService = new MainService(summaryRepository);

  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    const summary = await mainService.getSummary();
    return res.json(summary);
  });

  app.use('/api/summary', router);
}

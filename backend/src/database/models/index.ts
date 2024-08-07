import CarModel from './car';
import ShopModel from './shop';
import { SummaryModel } from './summary.model';

export const Models = { ...CarModel, ...ShopModel, SummaryModel };

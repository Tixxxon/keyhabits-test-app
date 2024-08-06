import { Pool } from 'pg';

export interface Model {
  initModel: () => Promise<void>;
}

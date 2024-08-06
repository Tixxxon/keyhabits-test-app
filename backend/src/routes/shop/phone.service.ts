export class PhoneService {
  private static Instance: PhoneService;
  constructor() {
    PhoneService.Instance = this;
  }

  static getInstance() {
    return PhoneService.Instance;
  }
}

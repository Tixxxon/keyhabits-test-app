export class EnvFileParseError extends Error {
  constructor(missingFields: string[]) {
    super();
    this.name = 'EnvFileParseError';
    this.message = `Ошибка проверки конфигурационного файла .env\nОтсутствуют следующие поля: ${missingFields.join(' ')}`;
  }
}

export class ConfigKeyError extends Error {
  constructor(key: string) {
    super();

    this.name = 'ConfigKeyError';
    this.message = `Поле ${key} не существует в текущей конфигурации`;
  }
}

import { Type, Inject } from '@one/core';

import { getRepositoryToken } from '../get-repository-token';

export function InjectRepository(collection: Type<any>) {
  return (target: object, propertyKey: string) => {
    const token = getRepositoryToken(collection);
    return Inject(token)(target, propertyKey);
  };
}

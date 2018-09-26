import { RouterProxy } from '@nest/server/router/router-proxy.service';
import { BadRequestException } from '@nest/server/errors';
import { RoutesResolver } from '@nest/server/router';
import { HTTP_SERVER } from '@nest/server';
import { Testing } from '@nest/testing';

import { FakeAdapter } from '../fake-adapter';

describe('RoutesResolver', () => {
  let routesResolver: RoutesResolver;
  let fixture: Testing.Fixture;

  beforeEach(async () => {
    fixture = await Testing.create({
      providers: [
        /*{
          provide: HTTP_SERVER_OPTIONS,
          useValue: {},
        },*/
        {
          provide: HTTP_SERVER,
          useClass: FakeAdapter,
        },
        RouterProxy,
        RoutesResolver,
      ],
    }).compile();
    routesResolver = fixture.get(RoutesResolver);
  });

  describe('mapExternalExceptions', () => {
    describe('SyntaxError', () => {
      it('should map to BadRequestException', () => {
        const err = new SyntaxError();
        const outputErr = routesResolver.mapExternalException(err);
        expect(outputErr).toBeInstanceOf(BadRequestException);
      });
    });
    describe('other', () => {
      it('should behave as an identity', () => {
        const err = new Error();
        const outputErr = routesResolver.mapExternalException(err);
        expect(outputErr).toEqual(err);
      });
    });
  });
});
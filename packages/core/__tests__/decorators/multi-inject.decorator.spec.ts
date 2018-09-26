import { Injectable, InjectionToken, MissingInjectionTokenMessage, MultiInject } from '@nest/core';
import { Testing } from '@nest/testing';

describe('@MultiInject()', () => {
  it('should multi inject providers', async () => {
    interface Weapon {
      name: string;
    }

    const WEAPON = new InjectionToken<Weapon>('WEAPON');

    @Injectable()
    class Katana implements Weapon {
      name = 'Katana';
    }

    @Injectable()
    class Shuriken implements Weapon {
      name = 'Shuriken';
    }

    @Injectable()
    class Ninja {
      readonly katana: Katana;
      readonly shuriken: Shuriken;

      constructor(
        @MultiInject(WEAPON) weapons: Weapon[],
      ) {
        this.katana = weapons[0];
        this.shuriken = weapons[1];
      }
    }

    const fixture = await Testing.create({
      providers: [
        {
          provide: WEAPON,
          useClass: Katana,
          multi: true,
        },
        {
          provide: WEAPON,
          useClass: Shuriken,
          multi: true,
        },
        Ninja,
      ],
    }).compile();

    const weapons = fixture.getAll<Weapon>(WEAPON);

    expect(weapons).toHaveLength(2);
    expect(weapons[0]).toBeInstanceOf(Katana);
    expect(weapons[1]).toBeInstanceOf(Shuriken);
  });

  it('should throw error when not using an injection token', () => {
    const message = MissingInjectionTokenMessage('@MultiInject()');

    expect(() => {
      interface Weapon {}
      class Ninja implements Weapon {}

      class Test {
        constructor(
          @MultiInject(Ninja) weapons: Weapon[],
        ) {}
      }
    }).toThrow(message);
  });
});
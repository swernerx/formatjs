import * as path from 'path';
import * as fs from 'fs';
import * as babel from '@babel/core';
import plugin from '../src';

function trim(str) {
  return str.toString().replace(/^\s+|\s+$/, '');
}

const skipOutputTests = [
  '.babelrc',
  '.DS_Store',
  'enforceDescriptions',
  'extractSourceLocation',
  'extractFromFormatMessageCall',
  'moduleSourceName',
  'icuSyntax',
  'removeDescriptions',
  'overrideIdFn',
  'removeDefaultMessage',
  'additionalComponentNames'
];

const fixturesDir = path.join(__dirname, 'fixtures');
const baseDir = path.join(__dirname, '..');

describe('emit asserts for: ', () => {
  fs.readdirSync(fixturesDir).map(caseName => {
    if (skipOutputTests.indexOf(caseName) >= 0) return;

    it(`output match: ${caseName}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);

      // Ensure messages are deleted
      const actualMessagesPath = path.join(fixtureDir, 'actual.json');
      if (fs.existsSync(actualMessagesPath)) fs.unlinkSync(actualMessagesPath);

      const actual = transform(path.join(fixtureDir, 'actual.js'));

      // Check code output
      expect(trim(actual)).toMatchSnapshot();

      // Check message output
      const expectedMessages = fs.readFileSync(
        path.join(fixtureDir, 'expected.json')
      );
      const actualMessages = fs.readFileSync(
        path.join(fixtureDir, 'actual.json')
      );
      expect(trim(actualMessages)).toEqual(trim(expectedMessages));
    });
  });
});

describe('options', () => {
  it('removeDefaultMessage should remove default message', () => {
    const fixtureDir = path.join(fixturesDir, 'removeDefaultMessage');

    const actual = transform(path.join(fixtureDir, 'actual.js'), {
      removeDefaultMessage: true
    });

    // Check code output
    expect(trim(actual)).toMatchSnapshot();

    // Check message output
    const expectedMessages = fs.readFileSync(
      path.join(fixtureDir, 'expected.json')
    );
    const actualMessages = fs.readFileSync(
      path.join(fixtureDir, 'actual.json')
    );
    expect(trim(actualMessages)).toEqual(trim(expectedMessages));
  });
  it('enforces descriptions when enforceDescriptions=true', () => {
    const fixtureDir = path.join(fixturesDir, 'enforceDescriptions');
    expect(() =>
      transform(path.join(fixtureDir, 'actual.js'), {
        enforceDescriptions: true
      })
    ).toThrow(/Message must have a `description`/);
  });

  it('correctly overrides the id when overrideIdFn is provided', () => {
    const fixtureDir = path.join(fixturesDir, 'overrideIdFn');

    const actual = transform(path.join(fixtureDir, 'actual.js'), {
      overrideIdFn: (id, defaultMessage, description) => {
        return `HELLO.${id}.${defaultMessage.length}.${typeof description}`;
      }
    });

    // Check code output
    expect(trim(actual)).toMatchSnapshot();

    // Check message output
    const expectedMessages = fs.readFileSync(
      path.join(fixtureDir, 'expected.json')
    );
    const actualMessages = fs.readFileSync(
      path.join(fixtureDir, 'actual.json')
    );
    expect(trim(actualMessages)).toEqual(trim(expectedMessages));
  });

  it('allows no description when enforceDescription=false', () => {
    const fixtureDir = path.join(fixturesDir, 'enforceDescriptions');
    expect(() =>
      transform(path.join(fixtureDir, 'actual.js'), {
        enforceDescriptions: false
      })
    ).not.toThrow();
  });

  it('removes descriptions when plugin is applied more than once', () => {
    const fixtureDir = path.join(fixturesDir, 'removeDescriptions');
    expect(() =>
      transform(
        path.join(fixtureDir, 'actual.js'),
        {
          enforceDescriptions: true
        },
        {
          multiplePasses: true
        }
      )
    ).not.toThrow();
  });

  it('respects moduleSourceName', () => {
    const fixtureDir = path.join(fixturesDir, 'moduleSourceName');
    expect(() =>
      transform(path.join(fixtureDir, 'actual.js'), {
        moduleSourceName: 'react-i18n'
      })
    ).not.toThrow();

    // Check message output
    const expectedMessages = fs.readFileSync(
      path.join(fixtureDir, 'expected.json')
    );
    const actualMessages = fs.readFileSync(
      path.join(fixtureDir, 'actual.json')
    );
    expect(trim(actualMessages)).toEqual(trim(expectedMessages));
  });

  it('respects extractSourceLocation', () => {
    const fixtureDir = path.join(fixturesDir, 'extractSourceLocation');
    expect(() =>
      transform(path.join(fixtureDir, 'actual.js'), {
        extractSourceLocation: true
      })
    ).not.toThrow();

    // Check message output
    const expectedMessages = fs.readFileSync(
      path.join(fixtureDir, 'expected.json')
    );
    const actualMessages = fs.readFileSync(
      path.join(fixtureDir, 'actual.json')
    );
    expect(trim(actualMessages)).toEqual(trim(expectedMessages));
  });

  it('respects extractFromFormatMessageCall', () => {
    const fixtureDir = path.join(fixturesDir, 'extractFromFormatMessageCall');
    expect(() =>
      transform(path.join(fixtureDir, 'actual.js'), {
        extractFromFormatMessageCall: true
      })
    ).not.toThrow();

    // Check message output
    const expectedMessages = fs.readFileSync(
      path.join(fixtureDir, 'expected.json')
    );
    const actualMessages = fs.readFileSync(
      path.join(fixtureDir, 'actual.json')
    );
    expect(trim(actualMessages)).toEqual(trim(expectedMessages));
  });

  it('additionalComponentNames', () => {
    const fixtureDir = path.join(fixturesDir, 'additionalComponentNames');
    expect(() =>
      transform(path.join(fixtureDir, 'actual.js'), {
        additionalComponentNames: ['CustomMessage']
      })
    ).not.toThrow();

    // Check message output
    const expectedMessages = fs.readFileSync(
      path.join(fixtureDir, 'expected.json')
    );
    const actualMessages = fs.readFileSync(
      path.join(fixtureDir, 'actual.json')
    );
    expect(trim(actualMessages)).toEqual(trim(expectedMessages));
  });
});

describe('errors', () => {
  it('Properly throws parse errors', () => {
    const fixtureDir = path.join(fixturesDir, 'icuSyntax');
    expect(() => transform(path.join(fixtureDir, 'actual.js'))).toThrow(
      /Expected .* but "\." found/
    );
  });
});

const BASE_OPTIONS = {
  messagesDir: baseDir
};

let cacheBust = 1

function transform(filePath, options = {}, { multiplePasses = false } = {}) {
  function getPluginConfig() {
    return [
      plugin,
      {
        ...BASE_OPTIONS,
        ...options
      },
      Date.now() + '' + (++cacheBust)
    ];
  }

  return babel.transformFileSync(filePath, {
    plugins: multiplePasses
      ? [getPluginConfig(), getPluginConfig()]
      : [getPluginConfig()]
  }).code;
}

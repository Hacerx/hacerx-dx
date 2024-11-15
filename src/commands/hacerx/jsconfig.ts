import { readFile, glob, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, basename } from 'node:path';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('hacerx-dx', 'hacerx.jsconfig');

export type JSConfigResult = {
  // name: string;
  // time: string;
};

export type JSConfigType = {
  compilerOptions: {
    experimentalDecorators: boolean;
    baseUrl: string;
    skipLibCheck: boolean;
    paths: Record<string, string[]>;
  };
  include: string[];
  typeAcquisition: {
    include: string[];
  };
  checkJS: boolean;
  allowJs: boolean;
  target: string;
  module: string;
};

const jsconfigBase: JSConfigType = {
  compilerOptions: {
    experimentalDecorators: true,
    baseUrl: '.',
    skipLibCheck: true,
    paths: {},
  },
  include: ['**/*', '.sfdx/typings/lwc/**/*.d.ts'],
  typeAcquisition: {
    include: ['jest'],
  },
  allowJs: true,
  checkJS: true,
  target: 'ESNext',
  module: 'NodeNext',
};

export default class JSConfig extends SfCommand<JSConfigType> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly requiresProject = true;

  public static readonly flags = {
    'base-url': Flags.directory({
      summary: messages.getMessage('flags.base-url.summary'),
      description: messages.getMessage('flags.base-url.description'),
      default: '.',
    }),
    init: Flags.boolean({
      summary: messages.getMessage('flags.init.summary'),
      description: messages.getMessage('flags.init.description'),
      default: false,
    }),
  };

  public async run(): Promise<JSConfigType> {
    const { flags } = await this.parse(JSConfig);

    let jsconfig;
    if (existsSync('./jsconfig.json')) {
      jsconfig = JSON.parse(await readFile('./jsconfig.json', 'utf-8')) as typeof jsconfigBase;
    }

    if (!jsconfig || flags.init) {
      jsconfig = jsconfigBase;
    }

    if (flags['base-url']) {
      jsconfig.compilerOptions.baseUrl = flags['base-url'];
    }

    const sfdxProjectJson = this.project?.getSfProjectJson();

    const pathDirectories = sfdxProjectJson?.getPackageDirectoriesSync().map((p) => p.path) || [];

    const globPatterns = pathDirectories.map((p) => `${p}/**/lwc/*/*.js`) || [];
    jsconfig.compilerOptions.paths = {};

    for await (const entry of glob(globPatterns, { cwd: flags['base-url'] || '.' })) {
      jsconfig.compilerOptions.paths[`c/${basename(dirname(entry))}`] = [entry.replace(/\\/g, '/')];
    }

    for (const path of pathDirectories) {
      const pathPattern = `${path}/**/*.d.ts`;
      if (!jsconfig.include.includes(pathPattern)) {
        jsconfig.include.push(pathPattern);
      }
    }

    await writeFile('./jsconfig.json', JSON.stringify(jsconfig, null, 2));

    return jsconfig;
  }
}

import { normalize } from 'node:path';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Connection, Messages } from '@salesforce/core';
import { type Schema } from '@jsforce/jsforce-node';
import { writeFile } from '../../impl/common/fies.js';
import { generateTypes } from '../../impl/types/generator.js';
import { getAllSobjects } from '../../impl/common/salesforce.js';
import { wildTest } from '../../impl/common/strings.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('hacerx-dx', 'hacerx.types');

export type HacerxTypesResult = {
  sobject: string;
  time: string;
};

export default class Types extends SfCommand<HacerxTypesResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'api-version': Flags.orgApiVersion({
      char: 'a',
      summary: messages.getMessage('flags.api-version.summary'),
      description: messages.getMessage('flags.api-version.description'),
    }),
    sobject: Flags.string({
      char: 's',
      summary: messages.getMessage('flags.sobject.summary'),
      description: messages.getMessage('flags.sobject.description'),
      multiple: true,
    }),
    'output-dir': Flags.directory({
      summary: messages.getMessage('flags.output-dir.summary'),
      default: './output',
    }),
    'case-insensitive': Flags.boolean({
      summary: messages.getMessage('flags.case-insensitive.summary'),
      description: messages.getMessage('flags.case-insensitive.description'),
      default: false,
    }),
    'target-org': Flags.requiredOrg(),
  };

  public async run(): Promise<HacerxTypesResult> {
    const { flags } = await this.parse(Types);
    const conn = flags['target-org'].getConnection(flags['api-version']);
    const wildcards = flags.sobject?.filter((sobject) => sobject.includes('*') || sobject.includes('.')) || [];
    let allSObjects: string[] = [];
    let checkSObjects: string[] = [];
    if (wildcards.length > 0 || flags.sobject?.length === 0) {
      allSObjects = await getAllSobjects(conn);
      checkSObjects = allSObjects.filter((sobject) =>
        wildcards.some((wildcard) => wildTest(wildcard, sobject, flags['case-insensitive']))
      );
    } else {
      checkSObjects = flags.sobject ? flags.sobject : allSObjects;
    }

    await Promise.all(checkSObjects.map((sobject) => this.generateFile(conn, sobject, flags['output-dir'])));

    const time = new Date().toDateString();

    return {
      sobject: checkSObjects.join(','),
      time,
    };
  }

  private async generateFile(conn: Connection<Schema>, sobject: string, outputDir: string): Promise<void> {
    this.log(`Processing ${sobject}`);
    const description = await conn.describe(sobject);
    const typed = generateTypes(description);
    const outputFile = normalize(`${outputDir}/${description.name}.d.ts`);
    await writeFile(outputFile, typed);
    this.log(`Processed ${sobject} - ${outputFile}`);
  }
}

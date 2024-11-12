/* eslint-disable @typescript-eslint/no-explicit-any */
export type NullableNumber = number | null | undefined;

export type SObjectSchema = {
  [key: string]: any;
  fields: SObjectFieldSchema[];
  childRelationships?: ChildRelationShip[];
  name: string;
  label: string;
  urls: URLS;
};

export type URLS = {
  [key: string]: string;
  uiNewRecord: string;
};

export type ChildRelationShip = {
  cascadeDelete: boolean;
  childSObject: string;
  deprecatedAndHidden: boolean;
  field: string;
  junctionIdListNames: [];
  junctionReferenceTo: [];
  relationshipName: string;
  restrictedDelete: boolean;
};

export type SObjectFieldSchema = {
  [key: string]: any;
  label: string;
  name: string;
  type: FieldType;
  nillable: boolean;
  createable: boolean;
  updateable: boolean;
  unique: boolean;
  autoNumber: boolean;
  calculated?: boolean;
  picklistValues?: PicklistValueSchema[];
  referenceTo?: string[];
  restrictedPicklist?: boolean;
};

export type PicklistValueSchema = {
  active: boolean;
  defaultValue: boolean;
  label: string;
  validFor: string[] | null;
  value: string;
};

export type FieldType =
  | 'picklist'
  | 'string'
  | 'textarea'
  | 'reference'
  | 'id'
  | 'boolean'
  | 'int'
  | 'currency'
  | 'percent'
  | 'number'
  | 'double'
  | 'date'
  | 'datetime'
  | 'any';

export type PicklistResult = {
  typeDefs: string[];
  typeNames: Map<string, string>;
};

export type SfdxConfig = {
  defaultusername: string;
};

export type Config = {
  sObjects: string[];
  sfPath: string;
  outputDir: string;
  defaultusername: string;
  sfdxDir: string;
};

export const scriptName = 'ftypes';

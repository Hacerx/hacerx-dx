/* eslint-disable import/no-extraneous-dependencies */
import { DescribeSObjectResult, Field } from '@jsforce/jsforce-node';
import { PicklistResult, PicklistValueSchema } from '../../types/common.js';

export function generateTypes(sObjectDef: DescribeSObjectResult): string {
  const fields = sObjectDef.fields;

  const picklistTypes = getPicklistTypes(sObjectDef.name, fields);

  const relations = generateChildRelations(sObjectDef);

  let tsContent = `${picklistTypes.typeDefs.join('\n')}\n\ntype ${sObjectDef.name} = {\n`;
  //     let tsContent = `
  //   import { SObject } from './BaseTypes';
  //   ${relations.imports}
  //   // picklist types
  // ${picklistTypes.typeDefs.join('\n')}

  //   export interface $ {sObjectDef.name
  // } extends SObject {
  // \n`;

  fields.forEach((field) => {
    let fieldType: string;
    const fieldName = field.name;

    if (field.type === 'picklist') {
      fieldType = picklistTypes.typeNames.get(field.name) as string;
    } else {
      fieldType = mapFieldType(field.type);
    }
    // const optional = field.nillable ? '?' : '';
    const readOnly = field.calculated || field.autoNumber ? 'readonly ' : '';
    tsContent += `${additionalFieldInfo(field)} \n`;
    tsContent += `${readOnly}${fieldName}?: ${fieldType}; \n`;
    if (field.relationshipName) {
      tsContent += `${additionalFieldInfo(field)} \n`;
      tsContent += `${field.relationshipName}?: Partial<${field.referenceTo?.join(' | ') ?? ''}>; \n`;
    }
  });

  tsContent += relations.childrenDef;

  // close object
  tsContent += '} \n';

  return tsContent.trim();
}

function buildPicklist(field: Field): string {
  if (field.picklistValues) {
    const active = (field.picklistValues as PicklistValueSchema[])
      .filter((p) => p.active === true)
      .map((p) => `'${p.value}'`);
    return active.join(' | ');
  }
  return '';
}

function getPicklistTypes(objName: string, field: Field[]): PicklistResult {
  const picklistTypes: PicklistResult = {
    typeDefs: [],
    typeNames: new Map(),
  };

  field
    .filter((f) => f.type === 'picklist')
    .forEach((f) => {
      const tName = `${objName}_${f.name}_Picklist`;
      const picklistType = `${buildPicklist(f)}${f.restrictedPicklist === true ? '' : ' | (string & {})'}`;
      picklistTypes.typeDefs.push(`type ${tName} = ${picklistType || "''"};`);
      picklistTypes.typeNames.set(f.name, tName);
    });

  return picklistTypes;
}

function additionalFieldInfo(field: Field): string {
  let moreInfo = '';
  const moreInfoPrefix = '\n* ';
  moreInfo += field.inlineHelpText ? `${moreInfoPrefix}@HelpText ${field.inlineHelpText}` : '';
  moreInfo += field.calculatedFormula ? `${moreInfoPrefix}@Formula - ${field.calculatedFormula}` : '';
  // moreInfo += field.calculated ? '\n    * @Formula' : '';
  moreInfo +=
    field.referenceTo && field.referenceTo.length > 0
      ? `${moreInfoPrefix}@RelatedTo - ${field.referenceTo?.join(',')}`
      : '';
  moreInfo += field.relationshipName ? `${moreInfoPrefix}@RelationshipName - ${field.relationshipName}` : '';
  moreInfo += field.unique ? `${moreInfoPrefix}@Unique` : '';
  moreInfo += field.autoNumber ? `${moreInfoPrefix}@Auto Number` : '';

  const cmt = `/**
     * @label ${field.label}
     * @type ${field.type}
     * @nillable ${field.nillable}
     * @Create ${field.createable}
     * @Update ${field.updateable}
     ${moreInfo.trim()} */`;

  return cmt;
}

function generateChildRelations(object: DescribeSObjectResult): { childrenDef: string; imports: string } {
  let childrenDef = '\n// Child relationships\n';
  const imports = '';
  object.childRelationships?.forEach((child) => {
    if (child.relationshipName) {
      const childType = child.childSObject ?? 'SObject';
      // const childType = (config as any)?.sObjects?.includes(child.childSObject) ?
      // child.childSObject : 'SObject'

      // if (childType !== 'SObject' && childType !== object.name) {
      //   imports += `import { ${childType} } from './${childType}';\n`;
      // }

      childrenDef += `/** 
     * @Object - ${child.childSObject}
     * @Field - ${child.field}
     * @cascadeDelete - ${child.cascadeDelete}
     * @restrictedDelete - ${child.restrictedDelete}
     **/
    ${child.relationshipName}?: ${childType}[];\n`;
    }
  });

  return { childrenDef, imports };
}

export function mapFieldType(salesforceType: string): string {
  switch (salesforceType) {
    case 'picklist':
    case 'string':
    case 'textarea':
    case 'reference':
    case 'id':
      return 'string';

    // boolean
    case 'boolean':
      return 'boolean';

    // numbers
    case 'int':
    case 'currency':
    case 'percent':
    case 'number':
    case 'double':
      return 'number';

    // dates
    case 'date':
    case 'datetime':
      return 'Date | string';

    // other
    default:
      return 'any';
  }
}

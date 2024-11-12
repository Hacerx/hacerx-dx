import { Connection } from '@salesforce/core';
import { type Schema } from '@jsforce/jsforce-node';

type EntityDefinition = {
  QualifiedApiName: string;
};

export async function getAllSobjects(conn: Connection<Schema>): Promise<string[]> {
  const { records } = await conn.query(
    'SELECT QualifiedApiName FROM EntityDefinition WHERE IsCustomizable = true ORDER BY QualifiedApiName'
  );
  return (records as EntityDefinition[]).map((r) => r.QualifiedApiName);
}

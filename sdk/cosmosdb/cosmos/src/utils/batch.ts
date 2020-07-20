import { JSONObject } from "../queryExecutionContext";
import { extractPartitionKey } from "../extractPartitionKey";
import { PartitionKeyDefinition } from "../documents";

export type Operation =
  | CreateOperation
  | UpsertOperation
  | ReadOperation
  | DeleteOperation
  | ReplaceOperation;

export interface Batch {
  min: string;
  max: string;
  rangeId: string;
  indexes: number[];
  operations: Operation[];
}

export interface OperationResponse {
  statusCode: number;
  requestCharge: number;
  eTag?: string;
  resourceBody?: JSONObject;
}

export function isKeyInRange(min: string, max: string, key: string) {
  const isAfterMinInclusive = key.localeCompare(min) >= 0;
  const isBeforeMax = key.localeCompare(max) < 0;
  return isAfterMinInclusive && isBeforeMax;
}

interface OperationBase {
  partitionKey?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
}

type OperationWithItem = OperationBase & {
  resourceBody: JSONObject;
};

type CreateOperation = OperationWithItem & {
  operationType: "Create";
};

type UpsertOperation = OperationWithItem & {
  operationType: "Upsert";
};

type ReadOperation = OperationBase & {
  operationType: "Read";
  id: string;
};

type DeleteOperation = OperationBase & {
  operationType: "Delete";
  id: string;
};

type ReplaceOperation = OperationWithItem & {
  operationType: "Replace";
  id: string;
};

export function hasResource(
  operation: Operation
): operation is CreateOperation | UpsertOperation | ReplaceOperation {
  return (operation as OperationWithItem).resourceBody !== undefined;
}

export function getPartitionKeyToHash(operation: Operation, partitionProperty: string) {
  const toHashKey = hasResource(operation)
    ? (operation.resourceBody as any)[partitionProperty]
    : operation.partitionKey.replace(/[\[\]\"\']/g, "");
  // We check for empty object since replace will stringify the value
  // The second check avoids cases where the partitionKey value is actually the string '{}'
  if (toHashKey === "{}" && operation.partitionKey === "[{}]") {
    return {};
  }
  return toHashKey;
}

export function addPKToOperation(operation: Operation, definition: PartitionKeyDefinition) {
  if (operation.partitionKey || !hasResource(operation)) {
    return operation;
  }
  const pk = extractPartitionKey(operation.resourceBody, definition);
  return { ...operation, partitionKey: JSON.stringify(pk) };
}

import { MurmurHash } from "./murmurHash";
import murmurHash3 from "murmurhash3js-revisited";

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
  operations: Operation[];
}

export const MAX_128_BIT_INTEGER = BigInt(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
);

export function hashv1PartitionKey(partitionKey: string): number {
  const toHash = partitionKey.substr(0, 100);
  const hashed = MurmurHash.hash(toHash, 0);
  return hashed;
}

export function hashv2PartitionKey(partitionKey: string): number {
  const partitionKeyBytes = Buffer.from(partitionKey, "hex");
  const hashed = murmurHash3.x86.hash128(partitionKeyBytes);
  // const hashed = MurmurHash.hash(partitionKey, 0);
  console.log({ hashed });
  const bytes = new Buffer(hashed.toString());
  console.log({ bytes });
  const reversed = reverse(bytes);
  console.log({ reversed });
  let reversedInt = Number(reversed.toString());
  console.log(reversedInt);
  const resetMSBInt = reversedInt & 536870911;
  console.log(resetMSBInt);
  return reversedInt;
}

export function isKeyInRange(min: bigint, max: bigint, key: bigint | number) {
  console.log({ min, max, key });
  const isAfterMinInclusive = min <= key;
  const isBeforeMax = max > key;
  console.log({ isAfterMinInclusive, isBeforeMax });
  return isAfterMinInclusive && isBeforeMax;
}

interface OperationBase {
  partitionKey: string;
  ifMatch?: string;
  ifNoneMatch?: string;
}

type OperationWithItem = OperationBase & {
  resourceBody: { [key: string]: string };
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

function reverse(buff: Buffer) {
  const buffer = Buffer.allocUnsafe(buff.length);

  for (let i = 0, j = buff.length - 1; i <= j; ++i, --j) {
    buffer[i] = buff[j];
    buffer[j] = buff[i];
  }

  return buffer;
}

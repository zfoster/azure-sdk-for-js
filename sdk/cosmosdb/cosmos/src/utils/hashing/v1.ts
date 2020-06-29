import { writeNumberForBinaryEncoding } from "./encoding/number";
import { writeStringForBinaryEncoding } from "./encoding/string";
import { MurmurHash } from "./murmurHash";

export function hashV1PartitionKey(partitionKey: string): string {
  const truncatedPartitionKey = partitionKey.substr(0, 100);
  const bytesToHash = Buffer.concat([
    // string prefix is 0x08
    Buffer.from("08", "hex"),
    Buffer.from(truncatedPartitionKey),
    // empty suffix
    Buffer.from("00", "hex")
  ]);
  const hash = MurmurHash.hash(bytesToHash.toString(), 0);
  const encodedHash = writeNumberForBinaryEncoding(hash);
  const encodedValue = writeStringForBinaryEncoding(truncatedPartitionKey);
  return Buffer.concat([encodedHash, encodedValue])
    .toString("hex")
    .toUpperCase();
}

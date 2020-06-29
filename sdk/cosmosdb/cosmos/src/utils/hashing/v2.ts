import murmurhash3 from "murmurhash3js-revisited";
// import { BytePrefix } from "./encoding/prefix";
import { writeNumberForBinaryEncoding } from "./encoding/number";
import { writeStringForBinaryEncoding } from "./encoding/string";

export function hashV2PartitionKey(partitionKey: string): string {
  const toHash = partitionKey.substr(0, 100);
  const bytesToHash = Buffer.concat([
    // string prefix is 0x08
    Buffer.from("08", "hex"),
    Buffer.from(toHash),
    // empty suffix
    Buffer.from("00", "hex")
  ]);
  const hash = murmurhash3.x86.hash32(bytesToHash);
  const encodedHash = writeNumberForBinaryEncoding(hash);
  const encodedValue = writeStringForBinaryEncoding(toHash);
  return Buffer.concat([encodedHash, encodedValue])
    .toString("hex")
    .toUpperCase();
}

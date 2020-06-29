import { BytePrefix } from "./prefix";

export function writeNumberForBinaryEncoding(hash: number) {
  let payload = encodeNumberAsUInt64(hash);
  let outputStream = Buffer.alloc(7);

  // First byte is always 0x05
  outputStream[0] = BytePrefix.Number;

  // Second byte is the first byte of the payload
  const firstByte = payload >> 56n;
  outputStream[1] = Number(firstByte);
  payload = payload << 8n;

  // Bytes 3-6 are 7 bits from payload with a single `1` bit at the end
  for (let index = 2; index < 6; index++) {
    const byteToWrite = (payload >> 56n) | 0x01n;
    payload = payload << 7n;
    outputStream[index] = Number(byteToWrite);
  }

  // The last byte is the next 7 bits with a single 0 at the end
  outputStream[6] = Number((payload >> 56n) & 0xfen);
  return outputStream;
}

function encodeNumberAsUInt64(value: number) {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const rawValueBits = view.getBigInt64(0);
  const mask = 0x8000000000000000n;
  const returned = rawValueBits < mask ? rawValueBits ^ mask : ~BigInt(rawValueBits) + 1n;
  return returned;
}

import { hashv1PartitionKey } from "../../src/utils/batch";
import assert from "assert";

describe("effectivePartitionKey", function() {
  describe.only("computes v1 key", function() {
    const toMatch = [
      {
        key: "partitionKey",
        output: "05C1E1B3D9CD2608716273756A756A706F4C667A00"
      },
      {
        key: "",
        output: "05C1CF33970FF80800"
      }
    ];
    toMatch.forEach(({ key, output }) => {
      it("matches expected hash output", function() {
        const hashed = hashv1PartitionKey(key);
        assert.equal(hashed, output);
      });
    });
  });
});

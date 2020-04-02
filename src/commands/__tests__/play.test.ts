import { execute } from "../play";

describe("play", () => {
  it("should throw when called without a message", async () => {
    await expect(
      // @ts-ignore
      execute(undefined, undefined)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"could not establish connection"`
    );
  });
});

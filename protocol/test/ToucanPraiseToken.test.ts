import { expect } from "chai";
require("dotenv").config();

describe("Testing if a === b", () => {
  it("Expecting a === b", () => {
    const a: string = "a";

    expect(a).to.eql("b");
  });
});

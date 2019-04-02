import { decTo64, ipEncode, decFrom64, ipDecode } from "./hash";

describe("decTo64", () => {
  it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(
    "should return single digits as themselves (but string)",
    n => {
      expect(decTo64(n)).toEqual(n.toString());
    }
  );

  it("should still be 1 char at 63", () => {
    expect(decTo64(63).split("").length).toEqual(1);
  });

  it("should wrap to 2 chars at 64", () => {
    expect(decTo64(64).split("").length).toEqual(2);
  });

  it.each(["hello", true, () => {}, [], {}])("throws if not a number", x => {
    expect(() => decTo64(x)).toThrow();
  });

  it.each(["5", "9abc", "+6", "-1"])(
    "should accept strings which beat parseInt",
    n => {
      expect(decTo64(n)).toEqual(parseInt(n).toString());
    }
  );

  it.each([1.5, "1.5"])("throws if not an integer", n => {
    expect(() => decTo64(n)).toThrow();
  });
});

describe("decFrom64", () => {
  it.each([0, 63, 64, 127, 128, 62000])(
    "should round trip decTo64 outputs",
    n => {
      expect(decFrom64(decTo64(n))).toEqual(n);
    }
  );
});

describe("ipEncode", () => {
  it.each(["123", "abc", "1.1.1", "1.a.5", "1.a.5.27"])(
    "throws if not an ipv4 address",
    ip => {
      expect(() => ipEncode(ip)).toThrow();
    }
  );

  it.each([
    ["64.0.0.0", "8"],
    ["0.64.0.0", "4"],
    ["0.0.64.0", "2"],
    ["0.0.0.64", "1"],
    ["64.64.0.0", "c"],
    ["64.0.64.0", "a"],
    ["64.0.0.64", "9"],
    ["0.64.64.0", "6"],
    ["0.64.0.64", "5"],
    ["0.0.64.64", "3"],
    ["64.64.64.0", "e"],
    ["64.64.0.64", "d"],
    ["64.0.64.64", "b"],
    ["0.64.64.64", "7"],
    ["64.64.64.64", "f"]
  ])("calculates flags correctly", (ip, flags) => {
    const result = ipEncode(ip);
    expect(result.split("")[0]).toEqual(flags);
  });

  it("excludes flags when flag value is 0", (ip = "63.63.63.63") => {
    const result = ipEncode(ip);
    expect(result.length).toEqual(4);
  });

  it.each([
    ["0.0.0.0", "0000"],
    ["127.0.0.1", "81_001"],
    ["255.255.255.255", "f3_3_3_3_"],
    ["192.168.0.1", "c302E01"]
  ])("should correcly encode IP octets with flags", (ip, hash) => {
    expect(ipEncode(ip)).toEqual(hash);
  });
});

describe("ipDecode", () => {
  it.each(["", "1", "12", "123"])(
    "should throw for an input of less than 4 characters",
    hash => {
      expect(() => ipDecode(hash)).toThrow();
    }
  );

  it.each(["0.0.0.0", "127.0.0.1", "255.255.255.255", "192.168.0.1"])(
    "should round trip ipEncode outputs",
    ip => {
      expect(ipDecode(ipEncode(ip))).toEqual(ip);
    }
  );
});

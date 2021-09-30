function guidToBinData(guid) {
  var guid = guid.replace(/[{}-]/g, ""); // remove extra characters

  // note: string representation of a GUID has some unusual byte orderings!
  var field1 = guid.substr(0, 8);
  var field2 = guid.substr(8, 4);
  var field3 = guid.substr(12, 4);
  var field4 = guid.substr(16, 4);
  var field5 = guid.substr(20, 12);
  field1 =
    field1.substr(6, 2) +
    field1.substr(4, 2) +
    field1.substr(2, 2) +
    field1.substr(0, 2);
  field2 = field2.substr(2, 2) + field2.substr(0, 2);
  field3 = field3.substr(2, 2) + field3.substr(0, 2);
  var hex = field1 + field2 + field3 + field4 + field5;

  // convert hex to base64
  var base64Digits =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var base64 = "";
  var group;
  for (var i = 0; i < 30; i += 6) {
    group = parseInt(hex.substr(i, 6), 16);
    base64 += base64Digits[(group >> 18) & 0x3f];
    base64 += base64Digits[(group >> 12) & 0x3f];
    base64 += base64Digits[(group >> 6) & 0x3f];
    base64 += base64Digits[group & 0x3f];
  }
  group = parseInt(hex.substr(30, 2), 16);
  base64 += base64Digits[(group >> 2) & 0x3f];
  base64 += base64Digits[(group << 4) & 0x3f];
  base64 += "==";

  return new BinData(3, base64);
}

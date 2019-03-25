const fs = require("fs");
const pkg = require("../package.json");

const filePath = `dist/${pkg.bundle}.js`;

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) throw err;

  // replace the opening `var` with a `const` so it's module scoped
  data = data.replace(/^var/, "const");

  // append our esm exports
  data += `
    
export const name = DecsysComponent.default.name;
export default DecsysComponent.default;
    `;

  fs.writeFile(filePath, data, "utf-8", err => {
    if (err) throw err;
    console.log("Fixed bundle exports for browser module use.");
  });
});

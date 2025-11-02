// fix-imports.js
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src");

function replaceImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  const updated = content.replace(/from\s+['"]@src\/([^'"]+)['"]/g, (match, importPath) => {
    const absoluteImportPath = path.join(SRC_DIR, importPath);
    let relativePath = path.relative(path.dirname(filePath), absoluteImportPath);

    // chuẩn hóa path cho JS (./ hoặc ../)
    if (!relativePath.startsWith(".")) {
      relativePath = "./" + relativePath;
    }

    // bỏ phần mở rộng .ts hoặc .js
    relativePath = relativePath.replace(/\.(ts|js)$/, "");

    return `from '${relativePath.replace(/\\/g, "/")}'`;
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✔ Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".ts")) {
      replaceImportsInFile(fullPath);
    }
  });
}

// chạy script
walkDir(SRC_DIR);

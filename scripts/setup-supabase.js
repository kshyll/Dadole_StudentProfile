const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const source = path.join(
    projectRoot,
    "node_modules",
    "@supabase",
    "supabase-js",
    "dist",
    "umd",
    "supabase.js"
);
const destination = path.join(projectRoot, "www", "js", "supabase.js");
const configExample = path.join(projectRoot, "www", "js", "supabase-config.example.js");
const configLocal = path.join(projectRoot, "www", "js", "supabase-config.js");

if (!fs.existsSync(source)) {
    console.error("Supabase library was not found. Run npm install again.");
    process.exit(1);
}

fs.copyFileSync(source, destination);

if (!fs.existsSync(configLocal)) {
    fs.copyFileSync(configExample, configLocal);
}

console.log("Supabase browser library is ready in www/js/supabase.js");
console.log("Configure www/js/supabase-config.js with your own Supabase project values.");

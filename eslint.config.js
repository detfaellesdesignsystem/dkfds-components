const js = require("@eslint/js");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
    {
        plugins: {
            js,
        },
        extends: ["js/recommended"],
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
            },
        },
        rules: {
            "no-duplicate-imports": "warn",
            "no-unused-vars": "warn",
            "eqeqeq": "warn",
            "no-console": "error"
        },
    },
]);
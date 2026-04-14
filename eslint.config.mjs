import pluginTypescript from "@typescript-eslint/eslint-plugin";
import parserTypescript from "@typescript-eslint/parser";
import js from "@eslint/js";
import fioriTools from "@sap-ux/eslint-plugin-fiori-tools";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseRules = {
    "linebreak-style": "off",
    "@typescript-eslint/naming-convention": [
        "error",
        {
            selector: ["variableLike", "memberLike"],
            format: ["camelCase"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid"
        },
        {
            selector: ["class", "interface", "typeAlias"],
            format: ["PascalCase"]
        },
        {
            selector: "property",
            format: ["camelCase"]
        }
    ],
    "semi": ["error", "always"],
    "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
    "@typescript-eslint/member-ordering": ["error", {
        default: [
            "signature",
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "constructor",
            "public-static-method",
            "protected-static-method",
            "private-static-method",
            "public-instance-method",
            "protected-instance-method",
            "private-instance-method"
        ]
    }],
    "no-var": "error",
    "@typescript-eslint/max-params": ["error", { max: 3 }],
    "max-len": ["error", {
        code: 160,
        tabWidth: 4,
        ignoreUrls: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreTrailingComments: true
    }],
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
    }],
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": ["error", {
        ignoreVoid: true,
        ignoreIIFE: false
    }],
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "no-undef": "off"
};

export default [
    js.configs.recommended,
    ...fioriTools.configs.recommended,
    {
        ignores: ["dist/**"]
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: parserTypescript,
            parserOptions: {
                ecmaVersion: "latest",
                projectService: true,
                tsconfigRootDir: __dirname
            }
        },
        plugins: {
            "@typescript-eslint": pluginTypescript
        },
        rules: baseRules
    },
    {
        files: ["**/*.types.ts"],
        languageOptions: {
            parser: parserTypescript,
            parserOptions: {
                ecmaVersion: "latest",
                projectService: true,
                tsconfigRootDir: __dirname
            }
        },
        plugins: {
            "@typescript-eslint": pluginTypescript
        },
        rules: {
            ...baseRules,
            semi: "off",
            "@typescript-eslint/naming-convention": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-unused-vars": "off"
        }
    },
    {
        files: ["src/interface/**/*.ts"],
        rules: {
            ...baseRules,
            semi: "off",
            "@typescript-eslint/no-explicit-any": "off"
        }
    },
    {
        files: ["src/control/**/*Renderer.ts", "src/control/enum/**/*.ts"],
        rules: {
            ...baseRules,
            "@typescript-eslint/naming-convention": "off"
        }
    }
];
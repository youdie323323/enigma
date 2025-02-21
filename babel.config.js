module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
    ],
    plugins: [
        ["@babel/plugin-syntax-explicit-resource-management", { loose: true }],
        ["@babel/plugin-proposal-decorators", { legacy: true, loose: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        ["@babel/plugin-transform-private-methods", { loose: true }],
        ["@babel/plugin-transform-private-property-in-object", { loose: true }]
    ]
};
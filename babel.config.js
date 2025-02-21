module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
    ],
    plugins: [
        ["@babel/plugin-syntax-explicit-resource-management"],
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: false }],
        ["@babel/plugin-transform-private-methods", { loose: false }],
        ["@babel/plugin-transform-private-property-in-object", { loose: false }]
    ]
};
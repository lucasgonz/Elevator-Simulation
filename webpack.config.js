const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/scripts/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "./dist/"),
        filename: "bundle.client.js",
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/views/index.html" })],
    devServer: {
        open: true,
    },
};

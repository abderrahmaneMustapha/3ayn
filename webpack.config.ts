const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./app/entry/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript"
        ] }
      },
      {
         test: /\.(s(a|c)ss)$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(css)$/,
       use: [
         "style-loader",
         "css-loader",
       ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(pdf)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }

    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".ts", ".tsx", ".json", ".png", ".scss"] },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/",
  },
  devServer: {
    static: path.join(__dirname, "assets"),
    port: 5050,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};

const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path')
const deps = require("./package.json").dependencies;
module.exports = {
  entry: path.join(__dirname, './src/index.ts'),

  output: {
    publicPath: "http://localhost:5000/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 5000,
    historyApiFallback: true,
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
				test: /\.(ts|tsx|js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ts-loader',
						options: {
							configFile: path.resolve('./tsconfig.json'),
						},
					},
				],
			},
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "pub_app",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};

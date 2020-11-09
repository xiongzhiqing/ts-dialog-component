const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  mode: 'development',
  devServer: {
    contentBase: '/dist', // 更目录
    open: true, // 自动打开页面
  },
  resolve: {
    "extensions": ['.ts', '.js', '.json'] // 省略后缀名
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: [
          path.resolve(__dirname, 'src/components')
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', {
          // 模块化css
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[path]-[name]-[local]-[hash:base64:6]', // 默认是'【hash:base64】'
            }, // 开启模块化
          }
        }],
        include: [
          path.resolve(__dirname, 'src/components')
        ]
      },
      {
        test: /\.(eot|woff2|woff|ttf|svg)/,
        use: ['file-loader']
      },
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // 自动引入js文件
    }),
    new CleanWebpackPlugin() // 文件清理（dist）
  ]
}
// https://github.com/zeit/next-plugins/tree/master/packages/next-css
const withCss = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')
module.exports = withCss(withTypescript())
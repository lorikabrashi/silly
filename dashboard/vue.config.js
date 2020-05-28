let publicPath = process.env.NODE_ENV === 'production' ? 'silly-admin-dashboard/' : '/';

module.exports = {
  publicPath,
  productionSourceMap: false,
};

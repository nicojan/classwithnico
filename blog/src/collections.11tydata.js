module.exports = {
  post: collection => collection.getFilteredByGlob("src/posts/**/*.md"),
};

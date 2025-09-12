const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSitemap = require("@11ty/eleventy-plugin-sitemap");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://blog.example.com" // TODO: change to your blog domain
    }
  });

  // Passthrough assets and CMS admin
  eleventyConfig.addPassthroughCopy({"admin": "admin"});
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

  // Date filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat("yyyy-LL-dd");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: "/"
  }
};

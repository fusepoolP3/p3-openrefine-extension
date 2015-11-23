var html = "text/html";
var encoding = "UTF-8";
var ClientSideResourceManager = Packages.com.google.refine.ClientSideResourceManager;

var LF = Packages.org.slf4j.LoggerFactory;
var logger = LF.getLogger("p3-openrefine-extension");


/*
 * Function invoked to initialize the extension.
 */
function init() {
  logger.info("Initializing extension resources");

  // Script files to inject into /project page
  ClientSideResourceManager.addPaths(
    "project/scripts",
    module,
    [
      "dialogs/about.js",
      "dialogs/factory.js",
      "scripts/project-injection.js",
      "scripts/rdfstore.js",
      "scripts/p3-platform-js.js"
    ]
  );

  // Style files to inject into /project page
  ClientSideResourceManager.addPaths(
    "project/styles",
    module,
    [
      "styles/project-injection.less",
      "dialogs/about.less",
    ]
  );
}
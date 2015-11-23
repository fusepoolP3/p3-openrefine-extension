// Bind a method to an object and cache it
Object.defineProperty(Object.prototype, "link", {
    value: function (methodName) {
        var boundName = "__link__" + methodName;
        return this[boundName] || (this[boundName] = this[methodName].bind(this));
    },
});


function AboutDialog() {}

AboutDialog.prototype = {
  init: function () {
    this.dialogElement = $(DOM.loadHTML("p3-openrefine-extension", "dialogs/about.html"));
    console.log(this.dialogElement);
    controls = DOM.bind(this.dialogElement);
    controls.close.click(this.link("hide"));
  },

  show: function () {
    this.init();
    this.dialogLevel = DialogSystem.showDialog(this.dialogElement);
  },

  hide: function () {
    DialogSystem.dismissUntil(this.dialogLevel - 1);
  },
};
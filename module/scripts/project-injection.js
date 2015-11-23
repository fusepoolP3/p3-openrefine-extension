// This file is added to the /project page

var P3Extension = {
platformURI: '',
handlers: {}
};


P3Extension.handlers.updatePlatformURI = function() {
     $.get(
           "command/core/get-preference",
           {name : "p3.platform.uri"},
           function(o) {
             if (o.value !== null) {
             console.log(o)
             P3Extension.platformURI = o.value
             } else {
            P3Extension.platformURI = 'http://' + window.location.hostname
             }
           }
     );
};

P3Extension.handlers.setPlatformURI = function() {
  var value = window.prompt("Set Platform URI:",P3Extension.platformURI);
  if (value !== null) {
    $.post(
      "command/core/set-preference",
      {
        name : "p3.platform.uri",
        value : JSON.stringify(value.trim().replace(/\/$/, ""))
      },
      function(o) {
        if (o.code == "error") {
          alert(o.message);
        }
      },
      "json"
    );
    P3Extension.handlers.updatePlatformURI();
  }
};

P3Extension.handlers.updatePlatformURI();

function dialogHandler(dialogConstructor) {
    var dialogArguments = Array.prototype.slice.call(arguments, 1);

    function Dialog() {
        return dialogConstructor.apply(this, dialogArguments);
    }

    Dialog.prototype = dialogConstructor.prototype;
    return function () {
        new Dialog().show();
    };
}

function showExtractor() {
    ui.historyPanel._extractOperations();
}

/* Add menu to extension bar */
ExtensionBar.addExtensionMenu({
    id: "p3-extesnsion",
    label: "P3Platform",
    submenu: [
        {
            id: "foo-extension/about",
            label: "Set platform URI",
            click: P3Extension.handlers.setPlatformURI
        },
        {
                    id: "foo-extension/about",
                    label: "Create transformer",
                    click: showExtractor
        },
        {
                    id: "foo-extension/about",
                    label: "About",
                    click: dialogHandler(AboutDialog)
        },
    ]
});
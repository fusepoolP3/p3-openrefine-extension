// This file is added to the /project page

var P3Extension = {
platformURI: '',
handlers: {}
};


P3Extension.handlers.updatePlatformURI = function() {
     var set = getURLParameter("platformURI");

         if (set.length > 0) {
             P3Extension.platformURI = set[0];
             $.post(
                   "command/core/set-preference",
                   {
                     name : "p3.platform.uri",
                     value : JSON.stringify(set[0].replace(/\/$/, ""))
                   },
                   function(o) {
                     if (o.code == "error") {
                       alert(o.message);
                     }
                   },
                   "json"
                 );
                 console.log("Got platformURI from query parameter: " +  set[0])
         } else {
            $.get(
            "command/core/get-preference",
            {name : "p3.platform.uri"},
            function(o) {
                 if (o.value !== null) {
                    console.log("Got platformURI from Refine get-preference API: "+ o.value)
                    P3Extension.platformURI = o.value
                    } else {
                    P3Extension.platformURI = 'http://' + window.location.hostname
                    console.log("Got platformURI from window.location: " + P3Extension.platformURI)
                   }
                 }
              );
    }
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

function getURLParameter(paramName) {
    var result = [];
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var parameterName = sURLVariables[i].split('=');
        if (parameterName[0] === paramName) {
            result.push(decodeURIComponent(parameterName[1]));
        }
    }
    return result;
}

P3Extension.handlers.updatePlatformURI();
/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
    * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// This file is added to the /project page

var SampleExtension = {
platformURI: '',
handlers: {}
};


SampleExtension.handlers.updatePlatformURI = function() {
     $.get(
           "command/core/get-preference",
           {name : "p3.platform.uri"},
           function(o) {
             if (o.value !== null) {
             console.log(o)
             SampleExtension.platformURI = o.value
             } else {
            SampleExtension.platformURI = 'http://' + window.location.hostname
             }
           }
     );
};

SampleExtension.handlers.setPlatformURI = function() {
  var value = window.prompt("Set Platform URI:",SampleExtension.platformURI);
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
    SampleExtension.handlers.updatePlatformURI();
  }
};

SampleExtension.handlers.updatePlatformURI();

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
            click: SampleExtension.handlers.setPlatformURI
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
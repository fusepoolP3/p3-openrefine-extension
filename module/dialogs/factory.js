function isEmpty(data) {
		if (typeof data === 'undefined' || data === '' || data === null || data.length == 0) {
			return true;
		}
		return false;
}

function createDefaultContainer(name) {
  query = "@prefix dct: <http://purl.org/dc/terms/> . \n" +
  		  "@prefix ldp: <http://www.w3.org/ns/ldp#>. \n" +
  		  "\n" +
  		  "<> a ldp:BasicContainer ; \n" +
  		  "\t dct:title \"OpenRefine trnasfom rules\" .";

  if (!isEmpty(name)) {
      putRequest = $.ajax({
               url: SampleExtension.platformURI + ':8181/ldp/' + name,
               type : "PUT",
               data : query,
               timeout: 3000,
               async: false,
               contentType: "text/turtle"
      });
      return putRequest.getResponseHeader('Location')
  }
}


HistoryPanel.prototype._showExtractOperationsDialog = function(json) {
  var self = this;
  var frame = $(DOM.loadHTML("sample", "dialogs/factory.html"));
  var elmts = DOM.bind(frame);

  elmts.destName.val(theProject.metadata.name.replace(' ','') + "_transform.json")
  elmts.trName.val("Batchrefine: " + theProject.metadata.name.replace(' ',''))

  elmts.postToPlatformButton.click(function() {
    try {
        rules = JSON.parse(elmts.textarea.text())
      } catch(err) {
        console.log("Error parsing JSON rules: "+err.message)
      }

      if (rules.length == 0) {
        alert("There are no transforms to upload")
        return
      }

      if (isEmpty(elmts.trName.val())) {
        alert("Please enter transformer name")
        return
      }

      if (isEmpty(elmts.contName.val())) {
           alert("Please enter container name")
          return
      }


    getContainerReq = $.ajax({
           	        url : SampleExtension.platformURI + ':8181/ldp/' + elmts.contName.val(),
           	        type : "GET",
           	        timeout: 3000,
           	        async : false,
                    })

    if (getContainerReq.status == 404) {
        if (confirm("Container " + elmts.contName.val() + " doesn't exist.\nDo you want to create it?")){
            console.log(createDefaultContainer(elmts.contName.val()))
        }  else {
           return;
        }
    }

     uploadRulesRequest = $.ajax({
      	url : SampleExtension.platformURI + ':8181/ldp/' +  elmts.contName.val(),
      	type : "POST",
      	timeout: 3000,
      	async : false,
      	headers : { "Slug": elmts.destName.val() } ,
      	contentType: 'application/json',
      	data : elmts.textarea.text(),
      	success : function(data,status, xhr) {
      		console.log(xhr.getResponseHeader('Location'));
      	},
      	error: function(jqXHR, textStatus, errorThrown) {
               alert(errorThrown);
        }
      })

      if (isEmpty(uploadRulesRequest.getResponseHeader('Location'))) {
         alert("Error uploading transformation rules")
      }

     P3Platform.getPlatform(SampleExtension.platformURI).then(function(p) {
       p.getTransformerRegistry().then(function(tr){
       tr.registerTransformer(
       SampleExtension.platformURI+":8310?refinejson="+encodeURIComponent(uploadRulesRequest.getResponseHeader('Location')),
         elmts.trName.val(),
         elmts.trDesc.val()
       )
       })
     },function(err){console.log("Error accessing platform: "+err)})

    });

  elmts.dialogHeader.html($.i18n._('core-project')["extract-history"]);
  elmts.or_proj_extractSave.html($.i18n._('core-project')["extract-save"]);
  elmts.selectAllButton.html($.i18n._('core-buttons')["select-all"]);
  elmts.unselectAllButton.html($.i18n._('core-buttons')["unselect-all"]);
  elmts.closeButton.html($.i18n._('core-buttons')["close"]);

  var entryTable = elmts.entryTable[0];
  var createEntry = function(entry) {
    var tr = entryTable.insertRow(entryTable.rows.length);
    var td0 = tr.insertCell(0);
    var td1 = tr.insertCell(1);
    td0.width = "1%";

    if ("operation" in entry) {
      entry.selected = true;

      $('<input type="checkbox" checked="true" />').appendTo(td0).click(function() {
        entry.selected = !entry.selected;
        updateJson();
      });

      $('<span>').text(entry.operation.description).appendTo(td1);
    } else {
      $('<span>').text(entry.description).css("color", "#888").appendTo(td1);
    }
  };
  for (var i = 0; i < json.entries.length; i++) {
    createEntry(json.entries[i]);
  }

  var updateJson = function() {
    var a = [];
    for (var i = 0; i < json.entries.length; i++) {
      var entry = json.entries[i];
      if ("operation" in entry && entry.selected) {
        a.push(entry.operation);
      }
    }
    elmts.textarea.text(JSON.stringify(a, null, 2));
  };
  updateJson();

  elmts.closeButton.click(function() { DialogSystem.dismissUntil(level - 1); });
  elmts.selectAllButton.click(function() {
    for (var i = 0; i < json.entries.length; i++) {
      json.entries[i].selected = true;
    }

    frame.find('input[type="checkbox"]').attr("checked", "true");
    updateJson();
  });
  elmts.unselectAllButton.click(function() {
    for (var i = 0; i < json.entries.length; i++) {
      json.entries[i].selected = false;
    }

    frame.find('input[type="checkbox"]').removeAttr("checked");
    updateJson();
  });

  var level = DialogSystem.showDialog(frame);
  $('div.history-extract-dialog-panel').css({'height':'200px'})
  elmts.textarea[0].select();
};

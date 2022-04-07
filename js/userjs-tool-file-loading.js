// Name         : userjs-tool-file-loading.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // downloadFile
    // *************************************

    // based on code from:
    // https://stackoverflow.com/questions/196498/how-do-i-load-the-contents-of-a-text-file-into-a-javascript-variable
    // https://stackoverflow.com/questions/6348207/making-a-paragraph-in-html-contain-a-text-from-a-file
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data
    // https://cameronnokes.com/blog/4-common-mistakes-front-end-developers-make-when-using-fetch/

    // browser security policies prevent same origin local file:// loading

    function downloadFile(url, text_box){
      var e = document.getElementById(text_box);
      var msg = "\nTroubleshooting:  Check connection?"
        + "  Blocked by an extension (eg uMatrix XHR)?"
        + "  Site allows fetch?  Valid URL/file?"
        + "  Visit the URL and copy/paste the content instead?\n"
        + url;
      clearTextAreaContents(text_box);
      toggleTextAreaReadOnly(text_box, true, false);
      fetch(url)
        .then(function(response) {
          if (response.ok) {
            return response.text()
          }
          else {
            throw Error(response.status);
          }
        })
        .then(function(text) {
          e.value = text;
        })
        .catch(function(err) {
          if (location.protocol == "file:") {
            console.error('// local (file:) fetch failed - firefox flip "security.fileuri.strict_origin_policy" (and change it back afterwards)');
          }
          alert("File fetch error:\n" + err.message + msg);
        });
    } // end function downloadFile

    // *************************************
    // loadButtonAction
    // *************************************

    function loadButtonAction(select, input, text_box, filenameforsave){
      var url = select.value;
      select.selectedIndex = 0;
      if (url == "LOCAL") {
        // trigger the (hidden) local file load selector (does not work for Fennec)
        if (
          document.getElementById("collect_button").style.textDecoration == "line-through"
          && (text_box == "box_1_template" || text_box == "box_2_overrides")
        ) {
          return;
        }
        document.getElementById(input).click();
      }
      else if (url == "BUTTON") {
        // show the Browse button (Fennec workaround)
        for (const id of [ "template", "overrides", "userjs", "other" ])
        {
          if (document.getElementById("load_" + id + "_input").style.display === "block") {
            document.getElementById("load_" + id + "_input").style.display = "none";
            document.getElementById("loadsave_" + id + "_select").options[2].textContent =
              document.getElementById("loadsave_" + id + "_select").options[2].textContent
              .replace(/\u{25A3}/u, "\u25A2");
          }
          else {
            document.getElementById("load_" + id + "_input").style.display = "block";
            document.getElementById("loadsave_" + id + "_select").options[2].textContent =
              document.getElementById("loadsave_" + id + "_select").options[2].textContent
              .replace(/\u{25A2}/u, "\u25A3");
          }
        }
      }
      else if (url == "SAVE") {
        download(document.getElementById(text_box).value,
          filenameforsave, "application/javascript");
      }
      else if (/^.+$/.test(url)) {
        if (
          document.getElementById("collect_button").style.textDecoration == "line-through"
          && (text_box == "box_1_template" || text_box == "box_2_overrides")
        ) {
          return;
        }
        if (url == "URL") {
          url = "";
          url = prompt("Please input URL of file to load\n"
            + "(Only works if the site allows this)\n"
            + "(eg arkenfox /master/ /vNN/ or /vNN.0-beta/ /NN.0/)",
            "https://raw.githubusercontent.com/arkenfox/user.js/master/user.js");
        }
        if (url != null && url != "") {
          downloadFile(url, text_box);
          setTimeout(function(){
            toggleTextAreaReadOnly(text_box, true);
            e.selectionStart = 0;
            e.selectionEnd = 0;
            e.focus();
          }, 1000);
        }
      }
    } // end function loadButtonAction

    // *************************************
    // loadLocalFile / drag and drop
    // *************************************

    // based on code from:
    // https://www.html5rocks.com/en/tutorials/file/dndfiles/
    // https://stackoverflow.com/questions/16215771/how-open-select-file-dialog-via-js/16215950
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    function loadLocalFile(ev, text_box){
      // get files from Browse selection or drag and drop
      var files = [];
      if (typeof ev == 'string') {
        var files = document.getElementById(ev).files;
      }
      else {
        // dropHandler(ev)
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
              files.push(ev.dataTransfer.items[i].getAsFile());
            }
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            files.push(ev.dataTransfer.files[i]);
          }
        }
      }

      // determine which box to load the selected files

      var fe, ft, fo, fu, fx;  // filename for each box (fe is current box)

      if (!files.length) {
        // no files selected
        return;
      }
      else if (files.length > 4) {
        alert("Too many files selected. (" + files.length + " > maximum 4)");
        return;
      }
      else if (files.length == 1) {
        // one file selected (load into current box)
        fe=files[0];
      }
      else {
        // multiple files selected (load into corresponding boxes)
        // loop through the file list
        var matched = "", noMatch = "";
        for (var i=0, f; f=files[i]; i++) {
          if ( (/^user\.js.*$/.test(f.name)) && (!fu) ) {
            if (!fu) { fu=f; } else { noMatch += "\n?: " + f.name; }
          }
          else if ( (/^user-overrides.*\.js$/.test(f.name)) && (!fo) ) {
            if (!fo) { fo=f; } else { noMatch += "\n?: " + f.name; }
          }
          else if ( (/user-template.*\.js$/.test(f.name)) && (!ft) ) {
            if (!ft) { ft=f; } else { noMatch += "\n?: " + f.name; }
          }
          else if ( (/^.*\.js$/.test(f.name)) && (!fx) ) {
            if (!fx) { fx=f; } else { noMatch += "\n?: " + f.name; }
          }
          else {
            noMatch += "\n?: " + f.name;
          }
        }
        matched = "\n1: "
        if (ft) { matched += ft.name ; }
        matched += "\n2: "
        if (fo) { matched += fo.name ; }
        matched += "\n3: "
        if (fu) { matched += fu.name ; }
        matched += "\n4: "
        if (fx) { matched += fx.name ; }
        if (noMatch) {
          noMatch = "\n\nNot matched to a box:" + noMatch;
        }
        if (!confirm("Load into boxes?" + matched + noMatch)) {
          return;
        }
      }

      // separate reads and variables (to avoid delayed loads into wrong box)

      if (fe) {
        var e = document.getElementById(text_box);
        var reader_e = new FileReader();
        // If we use onloadend, we need to check the readyState.
        reader_e.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            // if (typeof evt.target.result == 'string') {
              e.value = evt.target.result;
            // }
            // else {
            //   let utf8decoder = new TextDecoder('utf-8');
            //   e.value = utf8decoder.decode(decomp(evt.target.result));
            // }
            // e.select();
            toggleTextAreaReadOnly(text_box, true);
            e.selectionStart = 0;
            e.selectionEnd = 0;
            e.focus();
          }
        };
        reader_e.readAsText(fe);
        // reader_e.readAsArrayBuffer(fe);
        // reader_e.readAsBinaryString(fe);
      }

      if (ft) {
        var t = document.getElementById("box_1_template");
        var reader_t = new FileReader();
        // If we use onloadend, we need to check the readyState.
        reader_t.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            t.value = evt.target.result;
            toggleTextAreaReadOnly("box_1_template", true);
            // t.select();
            t.selectionStart = 0;
            t.selectionEnd = 0;
            t.focus();
          }
        };
        reader_t.readAsText(ft);
      }

      if (fo) {
        var o = document.getElementById("box_2_overrides");
        var reader_o = new FileReader();
        // If we use onloadend, we need to check the readyState.
        reader_o.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            o.value = evt.target.result;
            toggleTextAreaReadOnly("box_2_overrides", true);
            // o.select();
            o.selectionStart = 0;
            o.selectionEnd = 0;
            o.focus();
          }
        };
        reader_o.readAsText(fo);
      }

      if (fu) {
        var u = document.getElementById("box_3_userjs");
        var reader_u = new FileReader();
        // If we use onloadend, we need to check the readyState.
        reader_u.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            u.value = evt.target.result;
            toggleTextAreaReadOnly("box_3_userjs", true);
            // u.select();
            u.selectionStart = 0;
            u.selectionEnd = 0;
            u.focus();
          }
        };
        reader_u.readAsText(fu);
      }

      if (fx) {
        var x = document.getElementById("box_4_other");
        var reader_x = new FileReader();
        // If we use onloadend, we need to check the readyState.
        reader_x.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            x.value = evt.target.result;
            toggleTextAreaReadOnly("box_4_other", true);
            // t.select();
            x.selectionStart = 0;
            x.selectionEnd = 0;
            x.focus();
          }
        };
        reader_x.readAsText(fx);
      }

    } // end function loadLocalFile

    function dragOverHandler(ev) {
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    }

    function dropHandler1(ev) {
      if (
        document.getElementById("collect_button").style.textDecoration != "line-through"
      ) {
        loadLocalFile(ev, "box_1_template");
      }
    }

    function dropHandler2(ev) {
      if (
        document.getElementById("collect_button").style.textDecoration != "line-through"
      ) {
        loadLocalFile(ev, "box_2_overrides");
      }
    }

    function dropHandler3(ev) { loadLocalFile(ev, "box_3_userjs"); }

    function dropHandler4(ev) { loadLocalFile(ev, "box_4_other"); }

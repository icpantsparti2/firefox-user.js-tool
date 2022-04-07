// Name         : userjs-tool-start-up.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // handleActionURLparameter
    // *************************************

    function handleActionURLparameter() {
      var action = getURLVariable("action");
      if (!(action)) {
        return
      }
      console.log("action: "+action);
      switch (action) {
        case "view0":
          toggleActionsPanel(true);
          break;
        case "view1":
          document.getElementById("view_template_button").click();
          break;
        case "view2":
          document.getElementById("view_overrides_button").click();
          break;
        case "view3":
          document.getElementById("view_userjs_button").click();
          break;
        case "view4":
          document.getElementById("view_other_button").click();
          break;
        case "table1":
          document.getElementById("tableview_template_button").click();
          break;
        case "table2":
          document.getElementById("tableview_overrides_button").click();
          break;
        case "table3":
          document.getElementById("tableview_userjs_button").click();
          break;
        case "table4":
          document.getElementById("tableview_other_button").click();
          break;
        case "groups1":
          document.getElementById("view_template_button").click();
          document.getElementById("groups_button").click();
          break;
        case "groups2":
          document.getElementById("view_overrides_button").click();
          document.getElementById("groups_button").click();
          break;
        case "groups3":
          document.getElementById("view_userjs_button").click();
          document.getElementById("groups_button").click();
          break;
        case "groups4":
          document.getElementById("view_other_button").click();
          document.getElementById("groups_button").click();
          break;
        case "compare:"+(action.replace(/^compare:/, "")):
          userjsCompareLauncher(action);
          break;
        case "links":
        case "append":
        case "skeleton":
        case "collect":
        case "reduce":
        case "clean":
        case "byvalue":
        case "togroup":
        case "functions":
        case "help":
          document.getElementById(action+"_button").click();
          break;
      }
    } /* end of function handleActionURLparameter */




    // *************************************
    // userjstoolSetupInital
    // *************************************

    function userjstoolSetupInital() {

      updateDateTimeStampVariable();
      document.getElementById("hiddendate").innerHTML =
        document.getElementById("hiddendate").innerHTML
          .replace(/(--userjs_)[0-9_]*/, "$1" + date_time_stamp);

      document.body.style.whiteSpace = "nowrap";

      // hide the "this needs JavaScript" message
      document.getElementById("help_panel_nojs_div").style.display = "none";

      document.getElementById("index_select").selectedIndex=0;
      document.getElementById("size_select").selectedIndex=0;
      document.getElementById("menu_select").selectedIndex=0;

      // add user.js code into the text boxes if it was encoded in the body
      // use .innerHTML rather than (.innerText || .textContent)
      document.getElementById("box_1_template").value =
        b64DecodeUnicode(document.getElementById("base64_box_1").innerHTML);
      document.getElementById("box_2_overrides").value =
        b64DecodeUnicode(document.getElementById("base64_box_2").innerHTML);
      document.getElementById("box_3_userjs").value =
        b64DecodeUnicode(document.getElementById("base64_box_3").innerHTML);
      document.getElementById("box_4_other").value =
        b64DecodeUnicode(document.getElementById("base64_box_4").innerHTML);

      // add content for about:config functions
      var e = document.getElementById("functions_panel_textarea");
      e.value = b64DecodeUnicode(
        document.getElementById("base64_aboutconfig_functions").innerHTML
      );
      e.readOnly = true;

      // add choices (and URLs) to the load buttons
      for (const id of [
        "loadsave_template_select", "loadsave_overrides_select",
        "loadsave_userjs_select", "loadsave_other_select",
      ] ) {

        document.getElementById(id).innerHTML +=
          '<option value="LOCAL">Load local file [Browse]</option>';

        document.getElementById(id).innerHTML +=
          '<option value="BUTTON">&#x25A2;&#x00A0;&#x00A0;'
          + 'Show [Browse] buttons (if above fails)</option>';

        document.getElementById(id).innerHTML +=
          '<option value="URL">Download file from URL (if site allows)</option>';

        // if url parameters where given show these as options
        for (const load of [ "load1", "load2", "load3", "load4" ] ) {
          var loadurl = getURLVariable(load);
          if (loadurl != "" && loadurl != null) {
            document.getElementById(id).innerHTML +=
              '<option value="' + loadurl + '" title="' + loadurl + '">'
              + loadurl + '</option>';
          }
        }

        // pickup URLs from links_panel where name is tagged with '#'
        var o = document.getElementById("links_panel").getElementsByTagName("a");
        for (var i=0,j=o.length;i<j;i++) {
          if (/# *$/.test(o[i].innerHTML)) {
            document.getElementById(id).innerHTML +=
              '<option value="' + o[i].href + '" title="' + o[i].href + '">'
              + "Download " + o[i].innerHTML.replace(/ *# *$/, "")
              //+ (/github/.test(o[i].href) ? ' *' : '')
              + '</option>';
          }
        }

        document.getElementById(id).innerHTML +=
          '<option value="SAVE">Save box content as a file</option>';

      }

      // ensure initial "add content" message is visible
      setExpandAll(true);

    }  /* end function userjstoolSetupInital */




    // *************************************
    // userjstoolSetupURLvariables
    // *************************************

    function userjstoolSetupURLvariables() {

      if (arkenfoxRepoMode) {
        applyTheme("arkenfox");
        if (getURLVariable("theme")) {
          applyTheme(getURLVariable("theme"));
        }
        applyFontSize("70");
        if (arkenfoxRepoMode=="test") {
          document.getElementById("top_buttons_bar").style.top="1em";
          document.getElementById("top_buttons_bar").style.right="1em";
          document.getElementById("top_buttons_bar").style.zIndex = 1000;
        }
        else {
          document.getElementById("top_buttons_bar").style.display="none";
        }
        // for (const id of [ "groups_button","size_select","menu_select","back_button" ]) {
        //   document.getElementById(id).style.display="none";
        // }
      }
      else if (getURLVariable("theme")) {
        applyTheme(getURLVariable("theme"));
      }
      else {
        applyTheme("default");
      }

      if (getURLVariable("size")) {
        applyFontSize(getURLVariable("size"));
      }
      // else {
      //   // larger text size for mobile
      //   if (/(android|mobile)/i.test(navigator.userAgent)) {
      //     applyFontSize("150%");
      //   }
      // }

      if (getURLVariable("wrap") == "true") {
        setWrap("on");
      }

      if (getURLVariable("expand") == "true") {
        toggleExpandAllOnView("on");
      }

      if (getURLVariable("groups") == "true") {
        toggleGroupsOnView("on");
      }

      if (getURLVariable("viewplus") != "false") {
        toggleViewPlusOnView("on");
      }

      if (getURLVariable("prefix") == "true") {
        togglePrefixAboutConfigLinks("aboutblank#aboutconfig-toggle");
      }
      else if (getURLVariable("prefix") == "function") {
        togglePrefixAboutConfigLinks("aboutblank#function-toggle");
      }

      // folder for links to local files
      // (if used off-line "local links" default to .html location)
      if (getURLVariable("folder")) {
        applyFolderForLocalLinks(getURLVariable("folder"));
      }
      else if (window.location.protocol != "file:") {
        // if on-line version used, stop the "local links" working as we do
        // not want them pointing to non-existing files at the on-line location
        applyFolderForLocalLinks("file:");
      }

    }  /* end function userjstoolSetupURLvariables */



    // *************************************
    // userjstoolStart
    // *************************************

    /* ask for user.js input (or use content in body) (or load) */

    function userjstoolStart() {

      userjstoolSetupInital();
      userjstoolWhenArkenfoxRepoMode();
      userjstoolSetupEventListeners();
      userjstoolSetupURLvariables();
      toggleActionsPanel(true);
      toggleTemplateDiv();

      var timeoutDelay = false;  // gets set true if any content is auto-loaded

      // if user.js content saved in this HTML file (the divs at the bottom)
      // the userjstoolSetupInital function placed that content into a textarea
      if (document.getElementById("box_4_other").value != "") {
        toggleOtherDiv();
        document.getElementById("view_other_button").click();
      }
      else if (document.getElementById("box_3_userjs").value != "") {
        toggleUserjsDiv();
        document.getElementById("view_userjs_button").click();
      }
      else if (document.getElementById("box_1_template").value != "") {
        toggleTemplateDiv();
        document.getElementById("view_template_button").click();
      }
      else if (document.getElementById("box_2_overrides").value != "") {
        toggleOverridesDiv();
        document.getElementById("view_overrides_button").click();
      }

      // if load parameters in URL
      if (/^\?(a|av|at|g|gv|gt)($|&)/.test(location.search)) {
        toggleTemplateDiv();
        downloadFile(
          "https://raw.githubusercontent.com/arkenfox/user.js/master/user.js",
          "box_1_template");
        timeoutDelay = true;
      }
      else if ( (arkenfoxRepoMode) && !(getURLVariable("load1")) ) {
        // autoload user.js when this html location is an arkenfox repo
        toggleTemplateDiv();
        toggleActionsPanel(false);
        userjsTableView("box_1_template");
        if (arkenfoxRepoMode=="demo" || arkenfoxRepoMode=="test") {
          downloadFile(
            "https://raw.githubusercontent.com/arkenfox/user.js/master/user.js",
            "box_1_template");
        }
        else {
          downloadFile("user.js", "box_1_template");
        }
        timeoutDelay = true;
      }
      if (getURLVariable("load4") != "" && getURLVariable("load4") != null) {
        toggleOtherDiv();
        downloadFile(getURLVariable("load4"), "box_4_other");
        timeoutDelay = true;
      }
      if (getURLVariable("load3") != "" && getURLVariable("load3") != null) {
        toggleUserjsDiv();
        downloadFile(getURLVariable("load3"), "box_3_userjs");
        timeoutDelay = true;
      }
      if (getURLVariable("load2") != "" && getURLVariable("load2") != null) {
        toggleOverridesDiv();
        downloadFile(getURLVariable("load2"), "box_2_overrides");
        timeoutDelay = true;
      }
      if (getURLVariable("load1") != "" && getURLVariable("load1") != null) {
        toggleTemplateDiv();
        downloadFile(getURLVariable("load1"), "box_1_template");
        timeoutDelay = true;
      }

      // NOTE:
      //   if the code above loaded the file, the display does not render
      //   before the next code lines can see the text box has contents,
      //   so set a delay, which mostly works, and if it fails it only
      //   breaks auto view and the user can click a view button anyway
      setTimeout(function(){

        if (/^\?(av|gv)($|&)/.test(location.search)) {
          document.getElementById("view_template_button").click();
        }
        else if ( (/^\?(at|gt)($|&)/.test(location.search))
          || (arkenfoxRepoMode)
        ) {
          // document.getElementById("tableview_template_button").click();
          if ( !(document.getElementById("box_1_template").value == "") ) {
            toggleTextAreaReadOnly("box_1_template", true);
            toggleActionsPanel(false);
            userjsTableView("box_1_template",getURLVariable("t"),getURLVariable("s"));
          }
        }

        // when box parameter in URL
        switch (getURLVariable("box")) {
          case "0": toggleActionsPanel(false); break;
          case "1": toggleActionsPanel(true); toggleTemplateDiv(); break;
          case "2": toggleActionsPanel(true); toggleOverridesDiv(); break;
          case "3": toggleActionsPanel(true); toggleUserjsDiv(); break;
          case "4": toggleActionsPanel(true); toggleOtherDiv(); break;
          case "a": toggleActionsPanel(true); toggleAllDiv(); break;
          case "v": toggleActionsPanel(true); toggleAllDivVertical();
        }

        // make the textarea input boxes read only if they have content
        toggleTextAreaReadOnly("box_1_template", true);
        toggleTextAreaReadOnly("box_2_overrides", true);
        toggleTextAreaReadOnly("box_3_userjs", true);
        toggleTextAreaReadOnly("box_4_other", true);

        handleActionURLparameter();

        if (getURLVariable("jump") != "" && getURLVariable("jump") != null) {
          expandSectionWithFirstInstanceOfText(getURLVariable("jump"));
        }

      }, timeoutDelay ? 1000 : 0);

    }  /* end function userjstoolStart */

// Name         : userjs-tool-event-listeners.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // userjstoolSetupEventListeners
    // *************************************

    function userjstoolSetupEventListeners() {

      /* index_select (jump to section) */

      document.getElementById("index_select").addEventListener("change", function() {
        indexSelectAction(this);
      });

      /* groups button */

      document.getElementById("groups_button").addEventListener("click", function() {
        return_to_panel = "";
        toggleGroupsPanel();
        this.blur();
      });

      /* font size select */

      document.getElementById("size_select").addEventListener("change", function() {
        // change the font size to the value chosen
        // also changes the select element first choice name which we
        // are using as a title and it shows the current font size percent
        applyFontSize(document.getElementById("size_select").value);
        // make the select element show first choice (title)
        document.getElementById("size_select").selectedIndex = 0;
        this.blur();
      });

      /* menu select (...) */

      document.getElementById("menu_select").addEventListener("change", function() {
        if (/expand all on view/i.test(this.value)) {
          toggleExpandAllOnView();
        }
        else if (/collapse all/i.test(this.value)) {
          if (/tableview_div/.test(document.getElementById("view_area").innerHTML)) {
            userjsTableViewCollapseAll();
          }
          else {
            setExpandAll(false);
            if (section_focus) {
              refocusSection();
            }
          }
        }
        else if (/expand all/i.test(this.value)) {
          if (/tableview_div/.test(document.getElementById("view_area").innerHTML)) {
            userjsTableViewExpandAll();
          }
          else {
            setExpandAll(true);
            if (section_focus) {
              refocusSection();
            }
          }
        }
        else if (/collapse current/i.test(this.value)) {
          if (/tableview_div/.test(document.getElementById("view_area").innerHTML)) {
            userjsTableViewCollapseSectionDesc();
          }
          else if (section_focus) {
            if (section_focus.nextElementSibling != null) {
              section_focus.nextElementSibling.style.display = "none";
            }
            refocusSection();
          }
        }
        else if (/wrap/i.test(this.value)) {
          setWrap("toggle");
        }
        else if (/view\+ style/i.test(this.value)) {
          toggleViewPlusOnView();
        }
        else if (/prefix about:config/i.test(this.value)) {
          togglePrefixAboutConfigLinks("aboutblank#aboutconfig-toggle");
        }
        else if (/function about:config/i.test(this.value)) {
          togglePrefixAboutConfigLinks("aboutblank#function-toggle");
        }
        else if (/other themes/i.test(this.value)) {
          this.selectedIndex = 0;
          var new_value = prompt("Please input theme name.\n"
            + "default,dark,light,mono,inverse,none,...\n"
            + "(or on open: userjs-tool.html?theme=light)");
          applyTheme(new_value);
        }
        else if (/theme/i.test(this.value)) {
          applyTheme(this.value);
        }
        else if (/\[Actions\]/i.test(this.value)) {
          return_to_panel = "";
          toggleActionsPanel();
        }
        else if (/show groups on view/i.test(this.value)) {
          toggleGroupsOnView();
        }
        else if (/\[Groups\]/i.test(this.value)) {
          return_to_panel = "";
          toggleGroupsPanel();
        }
        else if (/\[Links\]/i.test(this.value)) {
          toggleLinksPanel();
        }
        else if (/\[about:config Functions\]/i.test(this.value)) {
          toggleFunctionsPanel();
        }
        else if (/\[Help\/Info\]/i.test(this.value)) {
          toggleHelpPanel();
        }

        // make the select element show first choice (title)
        this.selectedIndex = 0;
        this.blur();
      });

      /* readonly toggles */

      document.getElementById("box_1_template_ro").addEventListener("click", function() {
        toggleTextAreaReadOnly("box_1_template");
        this.blur();
      });

      document.getElementById("box_2_overrides_ro").addEventListener("click", function() {
        toggleTextAreaReadOnly("box_2_overrides");
        this.blur();
      });

      document.getElementById("box_3_userjs_ro").addEventListener("click", function() {
        toggleTextAreaReadOnly("box_3_userjs");
        this.blur();
      });

      document.getElementById("box_4_other_ro").addEventListener("click", function() {
        toggleTextAreaReadOnly("box_4_other");
        this.blur();
      });

      /* buttons for actions_panel options */

      // view

      document.getElementById("view_template_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_1_template").value == "")
        ) {
          toggleTextAreaReadOnly("box_1_template", true);
          toggleActionsPanel(false);
          userjsViewer("box_1_template");
        }
      });

      document.getElementById("view_overrides_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_2_overrides").value == "")
        ) {
          toggleTextAreaReadOnly("box_2_overrides", true);
          toggleActionsPanel(false);
          userjsViewer("box_2_overrides");
        }
      });

      document.getElementById("view_userjs_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_3_userjs").value == "")
        ) {
          toggleTextAreaReadOnly("box_3_userjs", true);
          toggleActionsPanel(false);
          userjsViewer("box_3_userjs");
        }
      });

      document.getElementById("view_other_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_4_other").value == "")
        ) {
          toggleTextAreaReadOnly("box_4_other", true);
          toggleActionsPanel(false);
          userjsViewer("box_4_other");
        }
      });

      // tableview

      document.getElementById("tableview_template_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_1_template").value == "")
        ) {
          toggleTextAreaReadOnly("box_1_template", true);
          toggleActionsPanel(false);
          userjsTableView("box_1_template");
        }
      });

      document.getElementById("tableview_overrides_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_2_overrides").value == "")
        ) {
          toggleTextAreaReadOnly("box_2_overrides", true);
          toggleActionsPanel(false);
          userjsTableView("box_2_overrides");
        }
      });

      document.getElementById("tableview_userjs_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_3_userjs").value == "")
        ) {
          toggleTextAreaReadOnly("box_3_userjs", true);
          toggleActionsPanel(false);
          userjsTableView("box_3_userjs");
        }
      });

      document.getElementById("tableview_other_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_4_other").value == "")
        ) {
          toggleTextAreaReadOnly("box_4_other", true);
          toggleActionsPanel(false);
          userjsTableView("box_4_other");
        }
      });

      // select

      document.getElementById("select_template_button").addEventListener("click", function() {
        selectTextAreaContents("box_1_template");
      });

      document.getElementById("select_overrides_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          // when collector mode is off
          selectTextAreaContents("box_2_overrides");
        }
        else {
          // when collector mode is on
          var e = document.getElementById("box_2_overrides");
          if (
            (e.selectionStart == 0 && e.selectionEnd == e.value.length)
            || (e.selectionStart == e.selectionEnd)
          ) {
            // when all or nothing is selected, select the opposite
            selectTextAreaContents("box_2_overrides");
          }
          else {
            // when text is already selected we will just focus
            // then what is already selected becomes apparent
            e.focus();
          }
        }
      });

      document.getElementById("select_userjs_button").addEventListener("click", function() {
        selectTextAreaContents("box_3_userjs");
      });

      document.getElementById("select_other_button").addEventListener("click", function() {
        selectTextAreaContents("box_4_other");
      });

      // functions_panel_textarea
      document.getElementById("select_functions_button").addEventListener("click", function() {
        selectTextAreaContents("functions_panel_textarea");
      });

      // load (hidden input button)

      document.getElementById('load_template_input').addEventListener('change', function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          loadLocalFile("load_template_input", "box_1_template");
        }
      }, false);

      document.getElementById('load_overrides_input').addEventListener('change', function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          loadLocalFile("load_overrides_input", "box_2_overrides");
        }
      }, false);

      document.getElementById('load_userjs_input').addEventListener('change', function() {
        loadLocalFile("load_userjs_input", "box_3_userjs");
      }, false);

      document.getElementById('load_other_input').addEventListener('change', function() {
        loadLocalFile("load_other_input", "box_4_other");
      }, false);

      // load/save (select button)

      document.getElementById("loadsave_template_select").addEventListener("change", function() {
        loadButtonAction(this, "load_template_input", "box_1_template",
          "user-template.js");
      });

      document.getElementById("loadsave_overrides_select").addEventListener("change", function() {
        loadButtonAction(this, "load_overrides_input", "box_2_overrides",
          "user-overrides.js");
      });

      document.getElementById("loadsave_userjs_select").addEventListener("change", function() {
        loadButtonAction(this, "load_userjs_input", "box_3_userjs", "user.js");
      });

      document.getElementById("loadsave_other_select").addEventListener("change", function() {
        updateDateTimeStampVariable();
        loadButtonAction(this, "load_other_input", "box_4_other",
          "user-other-" + date_time_stamp + ".js");
      });

      // clear

      document.getElementById("clear_template_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          clearTextAreaContents("box_1_template");
        }
      });

      document.getElementById("clear_overrides_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          clearTextAreaContents("box_2_overrides");
        }
      });

      document.getElementById("clear_userjs_button").addEventListener("click", function() {
        clearTextAreaContents("box_3_userjs");
      });

      document.getElementById("clear_other_button").addEventListener("click", function() {
        clearTextAreaContents("box_4_other");
      });

      // **************
      // boxdiv buttons
      // **************

      document.getElementById("div_1_template_button").addEventListener("click", function() {
        toggleTemplateDiv();
      });

      document.getElementById("div_2_overrides_button").addEventListener("click", function() {
        toggleOverridesDiv();
      });

      document.getElementById("div_3_userjs_button").addEventListener("click", function() {
        toggleUserjsDiv();
      });

      document.getElementById("div_4_other_button").addEventListener("click", function() {
        toggleOtherDiv();
      });

      document.getElementById("all_button").addEventListener("click", function() {
        if (document.getElementById("div_1_template").style.float == "left") {
          toggleAllDivVertical();
        }
        else {
          toggleAllDiv();
        }
      });

      // *************************************
      // action buttons
      // *************************************

      // arkenfox view

      document.getElementById('view_arkenfox_button').addEventListener('click', function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          toggleTemplateDiv();
          downloadFile(
            "https://raw.githubusercontent.com/arkenfox/user.js/master/user.js",
            "box_1_template");
          setTimeout(function(){
            document.getElementById("tableview_template_button").click();
          }, 1000);
        }
      }, false);

      // arkenfox load

      document.getElementById('load_arkenfox_button').addEventListener('click', function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
        ) {
          toggleTemplateDiv();
          downloadFile(
            "https://raw.githubusercontent.com/arkenfox/user.js/master/user.js",
            "box_1_template");
        }
      }, false);

      // compare

      document.getElementById("compare_select").addEventListener("change", function() {
        // user chooses the textarea input boxes for compare option
        // get the choice
        var choice = this.value;
        // make the select element show title (first option)
        this.selectedIndex = 0;
        userjsCompareLauncher(choice);
      });

      // append

      document.getElementById("append_button").addEventListener("click", function() {
        // output user.js (box3) = user-template.js (box1) append user-overrides.js (box2)
        if (
          !(document.getElementById("box_1_template").value == "")
          && !(document.getElementById("box_2_overrides").value == "")
        ) {
          userjsAppend("box_1_template", "box_2_overrides", "box_3_userjs");
          if (!checkIfAllButtonSelected()) { toggleUserjsDiv() }
          readOnlySelectTextAreaContents("box_3_userjs");
        }
      });

      // skeleton

      document.getElementById("skeleton_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_1_template").value == "")
        ) {
          userjsReduce("box_1_template", "box_2_overrides", true);
          if (!checkIfAllButtonSelected()) { toggleOverridesDiv() }
          readOnlySelectTextAreaContents("box_2_overrides");
        }
      });

      // collect

      document.getElementById("collect_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration != "line-through"
          && !(document.getElementById("box_1_template").value == "")
        ) {
          toggleOverridesDiv();
          // put collect mode on (line through buttons that are disabled)
          for (const id of [
            "view_template_button", "view_overrides_button",
            "view_userjs_button", "view_other_button",
            "tableview_template_button", "tableview_overrides_button",
            "tableview_userjs_button", "tableview_other_button",
            "clear_template_button", "clear_overrides_button",
            "view_arkenfox_button", "load_arkenfox_button",
            "compare_select", "skeleton_button", "collect_button",
            "byvalue_button", "togroup_button"
          ] ) {
            document.getElementById(id).style.textDecoration = "line-through";
          }
          document.getElementById("select_overrides_button").innerHTML = "Select+";
          // unhide end collect button
          document.getElementById("endcollect_button").style.color = "#FF0000"; /*Red*/
          document.getElementById("endcollect_button").style.backgroundColor = "#FFFF00"; /*Yellow*/
          document.getElementById("endcollect_button").style.display = "block";
          document.getElementById("endcollect_br").style.display = "block";
          // shrink the actions_panel, and focus it on Box 2
          // make collect_mode_pad visible (which makes the user.js HTML
          // lower, so the actions_panel will not obscure user.js HTML)
          document.getElementById("collect_mode_pad").style.display = "block";
          document.getElementById("actions_panel").style.maxHeight = "23%";
          document.getElementById("box_2_overrides").scrollIntoView();
          toggleTextAreaReadOnly("box_2_overrides", false);
          userjsViewer("box_1_template", true);
          // make the user.js HTML clickable (adds 100's of Event Listeners)
          addEventListenersForCollectMode();
        }
      });

      // end collect

      document.getElementById("endcollect_button").addEventListener("click", function() {
        if (
          document.getElementById("collect_button").style.textDecoration == "line-through"
        ) {
          // put collect mode off
          // remove the user.js HTML clickable (removes 100's of Event Listeners)
          removeEventListenersForCollectMode();
          for (const id of [
            "view_template_button", "view_overrides_button",
            "view_userjs_button", "view_other_button",
            "tableview_template_button", "tableview_overrides_button",
            "tableview_userjs_button", "tableview_other_button",
            "clear_template_button", "clear_overrides_button",
            "view_arkenfox_button", "load_arkenfox_button",
            "compare_select", "skeleton_button", "collect_button",
            "byvalue_button", "togroup_button"
          ] ) {
            document.getElementById(id).style.textDecoration = null;
          }
          document.getElementById("select_overrides_button").innerHTML = "Select";
          // unhide end collect button
          document.getElementById("endcollect_button").style.color = null;
          document.getElementById("endcollect_button").style.backgroundColor = null;
          document.getElementById("endcollect_button").style.display = "none";
          document.getElementById("endcollect_br").style.display = "none";
          // make actions_panel usual size and hide collect_mode_pad
          document.getElementById("collect_mode_pad").style.display = "none";
          document.getElementById("actions_panel").style.maxHeight = "75%";
          // display the collected values
          userjsViewer("box_2_overrides");
          toggleOverridesDiv();
          readOnlySelectTextAreaContents("box_2_overrides");
        }
      });

      // reduce

      document.getElementById("reduce_button").addEventListener("click", function() {
        if (!(document.getElementById("box_1_template").value == "")) {
          userjsReduce("box_1_template", "box_4_other");
          if (!checkIfAllButtonSelected()) { toggleOtherDiv() }
          readOnlySelectTextAreaContents("box_4_other");
        }
      });

      // clean

      document.getElementById("clean_button").addEventListener("click", function() {
        if (
          !(document.getElementById("box_3_userjs").value == "")
          && !(document.getElementById("box_4_other").value == "")
        ) {
          prefsjsClean("box_3_userjs", "box_4_other");
          if (!checkIfAllButtonSelected()) { toggleOtherDiv() }
          readOnlySelectTextAreaContents("box_4_other");
        }
      });

      // byvalue

      document.getElementById("byvalue_button").addEventListener("click", function() {
        if (
          (document.getElementById("collect_button").style.textDecoration != "line-through")
          && !(document.getElementById("box_3_userjs").value == "")
        ) {
          userjsToValueGroups("box_3_userjs", "box_4_other");
          if (!checkIfAllButtonSelected()) { toggleOtherDiv() }
          readOnlySelectTextAreaContents("box_4_other");
          userjsViewer("box_4_other");
          toggleGroupsPanel(true);
        }
      });

      // togroup

      document.getElementById("togroup_button").addEventListener("click", function() {
        if (
          (document.getElementById("collect_button").style.textDecoration != "line-through")
          && !(document.getElementById("box_4_other").value == "")
        ) {
          convertListToGroup("box_4_other");
          if (!checkIfAllButtonSelected()) { toggleOtherDiv() }
          readOnlySelectTextAreaContents("box_4_other");
          userjsViewer("box_4_other");
          setExpandAll(true)
          toggleGroupsPanel(true);
        }
      });

      // base64 encode/decode etc

      document.getElementById("encode_select").addEventListener("change", function() {
        var choice = this.selectedIndex;
        this.selectedIndex = 0;
        var e = document.getElementById("box_4_other");
        if (!(e.value == "")) {
          switch (choice) {
            case 1:
              // base64 encode text (and wrap encoded lines after 76 characters)
              e.value = b64EncodeUnicode(e.value).replace(/.{76}/g, "$&\n");
              break;
            case 2:
              // base64 encode text
              e.value = b64EncodeUnicode(e.value);
              break;
            case 3:
              // base64 decode text
              e.value = b64DecodeUnicode(e.value);
              break;
            case 4:
              e.value = encodeURIComponent(e.value);
              break;
            case 5:
              e.value = decodeURIComponent(e.value);
              break;
            case 6:
              e.value = encodeURI(e.value);
              break;
            case 7:
              e.value = decodeURI(e.value);
              break;
            case 8:
              e.value = RegExp.escape(e.value);
              break;
          }
          if (!checkIfAllButtonSelected()) { toggleOtherDiv() }
          readOnlySelectTextAreaContents("box_4_other");
        }
      });

      // functions for about:config

      document.getElementById("functions_button").addEventListener("click", function() {
        return_to_panel = "actions_panel";
        toggleFunctionsPanel(true);
      });

      // links

      document.getElementById("links_button").addEventListener("click", function() {
        return_to_panel = "actions_panel";
        toggleLinksPanel(true);
      });

      // help

      document.getElementById("help_button").addEventListener("click", function() {
        return_to_panel = "actions_panel";
        toggleHelpPanel(true);
      });

    }  /* end function userjstoolSetupEventListeners */

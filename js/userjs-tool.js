// Name         : userjs-tool.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06


    // *************************************
    // updateDateTimeStampVariable
    // *************************************

    function updateDateTimeStampVariable() {
      date_time_stamp = returnDateTime();
    }


    // *************************************
    // invertColorForClass
    // *************************************

    function invertColorForClass(classname) {
      var newbg = computedStyle(document.getElementById("view_area"),'color');
      var newfg = computedStyle(document.getElementById("view_area"),'backgroundColor');
      if (
        (newbg == 'rgb(0, 0, 0)' && newfg == 'rgba(0, 0, 0, 0)')
        || (newbg == 'rgba(0, 0, 0, 0)' && newfg == 'rgb(0, 0, 0)')
        || (newbg == newfg)
      ) {
        newfg = "#FFFFFF"; /*White*/
        newbg = "#000000"; /*Black*/
      }
      var e = document.getElementsByClassName(classname);
      for (var i=0,j=e.length;i<j;i++) {
        e[i].style.color = newfg;
        e[i].style.backgroundColor = newbg;
      }
    }




    // *************************************
    // tidySectionHeading
    // *************************************

    // used in userjsViewer and userjsReduce

    function tidySectionHeading(text, noInserts) {
      function tidySectionHeadingRegex(f,r) {
        var x = new RegExp(f, "i");
        text = text.replace(x, r);
      }

      // arkenfox style
      tidySectionHeadingRegex("^(?:\/\/ )?[ *\t]*[/][*][*][*-][ *\t]*\\[SECTION ([^\\]]*)\\]:[ \t]*(.*)[ *\t]*$", "$1: $2");
      if (!noInserts) {
        tidySectionHeadingRegex("^(?:\/\/ )?\/\\* *(START).*$", "0000: $1");
        tidySectionHeadingRegex("^(?:\/\/ )?\/\\* *(END).*$", "9999~ $1");
      }

      // pyllyukko style
      tidySectionHeadingRegex("^(?:\/\/ )?[ *\t]*SECTION:[ \t]*(.*)[ *\t]*$", "$1");

      // 12bytes style
      tidySectionHeadingRegex("^(?:\/\/ )?[ *=]*(WARINING.*DO NOT EDIT THIS FILE EXCEPT AS INSTRUCTED BELOW.*)$", "12bytes.org");
      tidySectionHeadingRegex("^(?:\/\/ )?[ *=]*(12BYTES\.ORG.*)$", "$1");
      tidySectionHeadingRegex("^(?:\/\/ )? [*] === (.*)$", "$1");
      tidySectionHeadingRegex("^(?:\/\/ )?[ *=]*(END 12BYTES\.ORG CUSTOMIZATION.*)$", "$1");
      tidySectionHeadingRegex("^(?:\/\/ )?[ *=]*(BEGIN USER CUSTOMIZATION.*)$", "$1");
      tidySectionHeadingRegex("^(?:\/\/ )?[ *=]*(END USER CUSTOMIZATION.*)$", "$1");

      // crssi style
      tidySectionHeadingRegex("^(?:\/\/ )?[ *=]*(HOME.*crssi.*)$", "crssi");

      // remove leading/trailing /*** etc
      tidySectionHeadingRegex("^[/][*][*][*-] *([^*])", "$1");
      // some leading/trailing character removal - eg ***/ === /*** etc
      tidySectionHeadingRegex("[ \t*=/-]*$", "");
      tidySectionHeadingRegex("^[ \t*=/-]*", "");
      // replace & < > characters with HTML escape codes
      return(escapeHtml(text));
    } /* end function tidySectionHeading */


    // *************************************
    // detectSectionHeading
    // *************************************

    // used in userjsViewer and userjsReduce

    function detectSectionHeading(line, userjs_type, line_number) {

      // narga style
      if (userjs_type == "narga" && line_number > 7) {
        if (new RegExp("^(?:\/\/ )?[ \t]+[*][^/]").test(line)) {
          return(true); }
        else {
          return(false);
        }
      }

      // arkenfox style
      else if (new RegExp("^(?:\/\/ )?[/][*][*][*-] *([^*])").test(line)) {
        return(true);
      }
      else if (new RegExp("^(?:\/\/ )?[/][*] *(START|END).*$").test(line)) {
        return(true);
      }

      // pyllyukko style
      else if (new RegExp("^(?:\/\/ )?[ *\t]*SECTION:[ \t]*(.*)[ *\t]*$").test(line)) {
        return(true);
      }

      // 12bytes style
      else if (new RegExp("^(?:\/\/ )?[ *=]*(WARINING.*DO NOT EDIT THIS FILE EXCEPT AS INSTRUCTED BELOW.*)$").test(line)) {
        return(true);
      }
      else if (new RegExp("^(?:\/\/ )?[ *=]*(12BYTES\.ORG.*)$").test(line)) {
        return(true);
      }
      else if (new RegExp("^(?:\/\/ )? [*] === (.*)$").test(line)) {
        return(true);
      }
      else if (
        new RegExp("^(?:\/\/ )?[ *=]*(END 12BYTES\.ORG CUSTOMIZATION.*)$").test(line)
      ) {
        return(true);
      }
      else if (
        new RegExp("^(?:\/\/ )?[ *=]*(BEGIN USER CUSTOMIZATION.*)$").test(line)
      ) {
        return(true);
      }
      else if (
        new RegExp("^(?:\/\/ )?[ *=]*(END USER CUSTOMIZATION.*)$").test(line)
      ) {
        return(true);
      }

      // crssi style
      else if (new RegExp("^(?:\/\/ )?[ *=]*(HOME.*crssi.*)$").test(line)) {
        return(true);
      }

      // krathalan style
      else if (
        new RegExp("^(?:\/\/ )?[ \t]*\/[/*][ \t]*--*[ \t]*([0-9]+[. ]|Section)").test(line)
      ) {
        return(true);
      }

      else {
        return(false);
      }

    } /* end function detectSectionHeading */


    // *************************************
    // detectUserjsType
    // *************************************

    // used in userjsViewer and userjsReduce

    function detectUserjsType(line, userjs_type, line_number) {
      // determine type (within first 10 lines)
      if (userjs_type == "" && line_number < 10) {
        if (
          new RegExp("^(?:\/\/ )?\\**[ \t]*name:[ \t]*(arkenfox|ghacks).user.js", "i").test(line)
        ) {
          userjs_type = "arkenfox";
        }
        else if (new RegExp("pyllyukko", "i").test(line)) {
          userjs_type = "pyllyukko";
        }
        else if (new RegExp("NARGA", "i").test(line)) {
          userjs_type = "narga";
        }
      }
      return userjs_type;
    } /* end function detectUserjsType */




    // *************************************
    // expandSectionWithFirstInstanceOfText
    // *************************************

    function expandSectionWithFirstInstanceOfText(text) {
      if (!text) {
        text = prompt("Jump to the section containing the first instance"
          + " of text entered", getURLVariable("jump"));
      }
      if (text) {
        var regexText = new RegExp(RegExp.escape(text), "i");
        var e = document.getElementsByClassName("content");
        for (var i=0, j=e.length; i<j; i++) {
          // .innerHTML (.innerText || .textContent)
          if (regexText.test(e[i].textContent)) {
            // expand/show section
            e[i].style.display = "block";
            section_focus = e[i];
            refocusSection();
            // highlight element (if text is not split across elements)
            var e2 = e[i].getElementsByTagName("*");
            for (var i2 = 0, j2 = e2.length; i2 < j2; i2++) {
              if (regexText.test(e2[i2].textContent)) {
                e2[i2].className += " jump";
                e2[i2].scrollIntoView();
                window.scrollBy(0, -200);
                break;
              }
            }
            break;
          }
        }
      }
    } /* end function expandSectionWithFirstInstanceOfText */


    // *************************************
    // convertListToGroup
    // *************************************

    function convertListToGroup(box_name) {
      var box = document.getElementById(box_name);
      var x, r;
      // change  \\* \\. \\+  to  * . +
      box.value = box.value.replace(/\\\\([*.+])/gm, "$1");
      box.value = box.value.replace(/\\([*.+])/gm, "$1");
      // change non user pref characters (<- include :/) to newline delimiters
      box.value = box.value.replace(/[^a-zA-Z0-9._*-:/]+/gm, "\n");
      // blank lines beginning http: https:
      box.value = box.value.replace(/^https?:.*$/gm, "");
      // change non user pref characters to newline delimiters
      box.value = box.value.replace(/[^a-zA-Z0-9._*-]+/gm, "\n");
      // remove end of line period
      box.value = box.value.replace(/\.$/gm, "");
      // blank lines not containing a period
      box.value = box.value.replace(new RegExp("^[^.\n]+$", "gm"), "");
      // blank lines not beginning a-z
      box.value = box.value.replace(/^[^a-zA-Z\n].*$/gm, "");
      // blank lines such as:  e.g  i.e
      box.value = box.value.replace(/^[a-z]\.[a-z]$/gm, "");
      // remove excess newlines
      box.value = box.value.replace(/[\r\n]+/g, "\n");
      box.value = box.value.replace(/^[\r\n]+/g, "");
      box.value = box.value.replace(/[\r\n]+$/g, "");
      // style as user_pref
      box.value = box.value.replace(/^.*$/gm, "user_pref(\"$&\", null);");
      updateDateTimeStampVariable();
      box.value = '/*** ' + date_time_stamp
        + ' preference group (from list) ***/\n\n' + box.value
      toggleTextAreaReadOnly(box_name, true);
    } /* end function convertListToGroup */


    // *************************************
    // prefsjsClean
    // *************************************

    function prefsjsClean(input_box_name, output_box_name) {
      var input_box = document.getElementById(input_box_name);
      var output_box = document.getElementById(output_box_name);
      var input_content = input_box.value.replace(/(\r\n|\r)/g,'\n').split("\n");
      var i = 0;
      for (i in input_content) {
        var line = input_content[i];
        var x;
        var prefName;
        x = new RegExp("^(.*user_pref)"  // $1 user_pref  //user_pref  etc
          + "([ \t]*\\([ \t]*[\"'])"     // $2 ("  ('
          + "([^\"']+)"                  // $3 prefname
          + "([\"'][ \t]*,[ \t]*)"       // $4 ",  ',
          + "(.*)"                       // $5 prefvalue  "prefvalue"  'prefvalue'
          + "([ \t]*\\)[ \t]*;)"         // $6 );
          + "(.*)$", "gi");              // $7 afters/comment
        if (x.test(line)) {
          prefName = line.replace(x,"$3");
          x = new RegExp("^.*user_pref[ \t]*\\([ \t]*[\"']"
            + RegExp.escape(prefName) + "[\"'].*$", "gm");
          output_box.value = output_box.value.replace(x, "");
        }
        // remove excess newlines (without messing up the header section)
        output_box.value = output_box.value.replace(/[\r\n][\r\n][\r\n]+/g, "\n");
        output_box.value = output_box.value.replace(/\.[\r\n]+user_pref\(/g, ".\n\nuser_pref\(");
        output_box.value = output_box.value.replace(/;[\r\n]+([ \t\/]*user_pref\()/g, ";\n$1");
        output_box.value = output_box.value.replace(/[\r\n]+$/g, "\n");
      }
      input_content = [];
    }  /* end function prefsjsClean */



    /* ************************************* */
    /* various control functions (for buttons/selects/initial) */
    /* ************************************* */


    // *************************************
    // findMenuSelectOption
    // *************************************

    function findMenuSelectOption(name_match) {
      var e = document.getElementById("menu_select");
      var found;
      for (var i=0,j=e.options.length;i<j;i++) {
        if (new RegExp(name_match, "i").test(e.options[i].textContent)) {
          if (typeof found == "number") {
            // more than one match
            found = null;
            break;
          }
          found = i;
        }
      }
      return found;
    }


    // *************************************
    // statusMenuSelectOption
    // *************************************

    function statusMenuSelectOption(i) {
      // a selected/on option will be prefixed with
      // WHITE SQUARE CONTAINING BLACK SMALL SQUARE
      if (typeof i == "number") {
        if (
          /^[\u{25A3}]/u.test(document.getElementById("menu_select").options[i].textContent)
        ) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return;
      }
    }


    // *************************************
    // updateMenuSelectOption
    // *************************************

    function updateMenuSelectOption(i, on) {
      if (typeof i == "string") {
        i = findMenuSelectOption(i);
      }
      if (typeof i == "number") {
        var t = document.getElementById("menu_select").options[i];
        t.textContent = t.textContent.replace(/^[\u{25A2}\u{25A3}\u{25EB}]+/u, "");
        if (typeof on !== "boolean") {
          // prefix when option is not a toggle
          // WHITE SQUARE WITH VERTICAL BISECTING LINE
          t.textContent = "\u25EB" + t.textContent;
        }
        else if (on) {
          // prefix when option selected (on/true)
          // WHITE SQUARE CONTAINING BLACK SMALL SQUARE
          t.textContent = "\u25A3" + t.textContent;
        }
        else {
          // prefix when option not selected (off/false)
          // WHITE SQUARE WITH ROUNDED CORNERS
          t.textContent = "\u25A2" + t.textContent;
        }
      }
    }


    // *************************************
    // toggleMenuSelectOption
    // *************************************

    function toggleMenuSelectOption(name, new_state) {
      // new_state: "toggle" (default) "on" "off" "refresh" "status"
      var opt = findMenuSelectOption(name);
      var on = statusMenuSelectOption(opt);
      if (new_state !== "status") {
        if (new_state === "on") {
          on = true;
        }
        else if (new_state === "off") {
          on = false;
        }
        else if (new_state !== "refresh") {
          on = !on;
        }
        updateMenuSelectOption(opt, on);
      }
        return on;
    }
    function toggleExpandAllOnView(new_state) {
      return toggleMenuSelectOption("expand all on view", new_state);
    }
    function toggleGroupsOnView(new_state) {
      return toggleMenuSelectOption("show groups on view", new_state);
    }
    function toggleViewPlusOnView(new_state) {
      return toggleMenuSelectOption("view\\+ style", new_state);
    }
    function toggleSetWrapOnMenu(new_state) {
      return toggleMenuSelectOption("wrap", new_state);
    }

    // *************************************
    // refocusSection
    // *************************************

    /* section focus */

    function refocusSection() {
      if (!section_focus) {
        section_focus = document.getElementById("TOP-Introduction");
      }
      section_focus.focus();
      // if (section_focus == document.getElementById("TOP-Introduction")) {
      //   section_focus.scrollIntoView(false);
      // }
      // else {
        section_focus.scrollIntoView();
        // body_height - (scroll_position + window_size)
        var position_from_bottom = Math.max(document.body.offsetHeight
          - (window.pageYOffset + window.innerHeight), 0);
        if (
          document.getElementById("collect_button").style.textDecoration == "line-through"
        ) {
          if (position_from_bottom > 200) { window.scrollBy(0, -200); }
        }
        else {
          if (position_from_bottom > 70) { window.scrollBy(0, -70); }
        }
      // }
    }


    // *************************************
    // togglePrefixAboutConfigLinks
    // *************************************

    /* prefix about:config links (about:blank#about:config) */

    function togglePrefixAboutConfigLinks(new_state) {
      // new_state: "toggle" (default) "on" "off" "refresh"
      //            "aboutblank#aboutconfig-toggle" "aboutblank#function-toggle"
      var aboutblank_opt = findMenuSelectOption("prefix about:config");
      var function_opt = findMenuSelectOption("function about:config");
      var aboutblank_on = false, function_on = false;
      if (new_state === "on") {
        aboutblank_on = true;
        function_on = false;
      }
      else if (new_state === "off") {
        aboutblank_on = false;
        function_on = false;
      }
      else if (new_state === "aboutblank#function-toggle") {
        aboutblank_on = false;
        function_on = statusMenuSelectOption(function_opt);
        // toggle
        function_on = !function_on;
      }
      else {
        // get current status
        aboutblank_on = statusMenuSelectOption(aboutblank_opt);
        function_on = statusMenuSelectOption(function_opt);
        // toggle if not refresh
        if (new_state !== "refresh") {
          // "aboutblank#aboutconfig-toggle"
          aboutblank_on = !aboutblank_on;
          function_on = false;
        }
      }
      // update
      var o = document.getElementsByTagName("a");
      for (var i=0,j=o.length;i<j;i++) {
        // remove unwanted style
        if (!function_on) {
          // remove the function prefixes
          if (/^about:blank#ujtFindPref/.test(o[i].href)) {
            o[i].href = o[i].href.replace(
              /^about:blank#ujtFindPref\({style:3,name:(.*)}\);$/,
              'about:config?filter=$1');
          }
        }
        if (!aboutblank_on) {
          // remove the about:blank# prefixes
          if (/^about:blank#about:config./.test(o[i].href)) {
            o[i].href = o[i].href.replace(/^about:blank#/,'');
          }
        }
        // add required style
        if (aboutblank_on) {
          // add the about:blank# prefixes
          if (/^about:config./.test(o[i].href)) {
            o[i].href = "about:blank#" + o[i].href;
          }
        }
        else if (function_on) {
          // add the function prefixes
          if (/^about:config\?filter=/.test(o[i].href)) {
            o[i].href = o[i].href.replace(
              /^about:config\?filter=(.*)$/,
              'about:blank#ujtFindPref({style:3,name:$1});'
            );
          }
        }
      }
      updateMenuSelectOption(aboutblank_opt, aboutblank_on);
      updateMenuSelectOption(function_opt, function_on);
    } /* end function togglePrefixAboutConfigLinks */

    // *************************************
    // applyFolderForLocalLinks
    // *************************************

    // local links that appear over the text boxes
    // change them from .html files location to specified location
    function applyFolderForLocalLinks(folder) {
      var e = document.getElementsByClassName("local_folder");
      for (var i=0,j=e.length;i<j;i++) {
        e[i].href = e[i].href.replace(/^.*\//, folder.replace(/\/$/, "") + '/');
      }
    }

    // *************************************
    // togglePanel
    // *************************************

    // force:  false for hide  true for show  unset for toggle
    function togglePanel(div_name, force) {

      var optInSelect = "", optButton = "";

      if (div_name == "back_button") {
        // get the current div_name
        var e = document.getElementsByClassName("panels");
        for (var i = 0, j = e.length; i<j; i++) {
          if (e[i].style.display == "block") {
            div_name = e[i].id;
            break;
          }
        }
      }

      if (div_name == "actions_panel" || div_name == "back_button") {
        optInSelect = findMenuSelectOption("\\[Actions\\]");
        div_name = "actions_panel"
      }
      else if (div_name == "groups_panel") {
        optInSelect = findMenuSelectOption("\\[Groups\\]");
        optButton = "groups_button";
      }
      else if (div_name == "links_panel") {
        optInSelect = findMenuSelectOption("\\[Links\\]");
      }
      else if (div_name == "functions_panel") {
        optInSelect = findMenuSelectOption("\\[about:config Functions\\]");
      }
      else if (div_name == "help_panel") {
        optInSelect = findMenuSelectOption("\\[help/info\\]");
      }
      else {
        optButton = div_name + "_button";
        if (div_name == "all-vertical") { optButton = "all_button" }
      }

      // function to toggle different elements
      var show = function(status, type, ids) {
        for (const id of ids) {
          if (type == "display") {
            document.getElementById(id).style.display = status ? "block" : "none";
          }
          else if (type == "display-inline") {
            document.getElementById(id).style.display = status ? "inline-block" : "none";
          }
          else if (type == "button") {
            document.getElementById(id).style.fontWeight = status ? 'bold' : null;
            document.getElementById(id).style.borderWidth = status ? '4px' : null;
          }
          else if (type == "outer") {
            document.getElementById(id).style.borderBottom = status ? "1px solid" : null;
          }
          else if (type == "inner") {
            document.getElementById(id).style.display = status ? "block" : "none";
            document.getElementById(id).style.width = status ? "50%" : null;
            document.getElementById(id).style.float = status ? "left" : null;
          }
          else if (type == "menu") {
            updateMenuSelectOption(id, status);
          }
        }
      }

      if (
        (force === false)
        || ((force !== true)
        && (document.getElementById(div_name).style.display === "block"))
      ) {
        // hide a panel (not for divs - they are forced true)
        if (document.getElementById(div_name).style.display === "block") {
          show(false, "display", [ div_name ] );
          show(false, "menu", [ optInSelect ] );
          document.getElementById("back_button").title = "Back to [Actions] (input panel)"
          if (optButton) { show(false, "button", [ optButton ] ) }
        }
        // if collector mode is on, show actions_panel (which then shows div_2_overrides)
        if (document.getElementById("collect_button").style.textDecoration == "line-through") {
          togglePanel("actions_panel");
        }
        else if (return_to_panel) {
          togglePanel(return_to_panel);
          return_to_panel = "";
        }
      }
      else {
        // show a panel/boxdiv (divs always forced true)

        if (div_name == "div_1_template"
          || div_name == "div_2_overrides"
          || div_name == "div_3_userjs"
          || div_name == "div_4_other"
          || div_name == "all"
          || div_name == "all-vertical"
        ) {
          // hide boxdivs and un-highlight buttons
          show(false, "inner", [ "div_1_template", "div_2_overrides",
            "div_3_userjs", "div_4_other" ] );
          show(false, "outer", [ "div_1_2", "div_3_4" ] );
          show(false, "button", [ "div_1_template_button",
            "div_2_overrides_button", "div_3_userjs_button",
            "div_4_other_button", "all_button" ] );
        }
        else {
          // hide panels and un-highlight menu/buttons
          show(false, "display", [ "actions_panel", "groups_panel",
            "links_panel", "functions_panel", "help_panel" ] );
          show(false, "menu", [ "\\[Actions\\]", "\\[Groups\\]",
            "\\[Links\\]", "\\[about:config Functions\\]",
            "\\[help/info\\]" ] );
          show(false, "button", [ "groups_button" ] );
          // highlight menu and show close button
          if (optInSelect) { show(true, "menu", [ optInSelect ] ) }
          document.getElementById("back_button").title =
            "Close ["
            + div_name.replace(/^(.).*$/, "$1").toUpperCase()
            + div_name.replace(/_/, "] ").replace(/^./, "");
        }

        // highlight button
        if (optButton) { show(true, "button", [ optButton ] ) }

        // show required panel/boxdivs
        if (div_name == "all") {
          show(true, "inner", [ "div_1_template", "div_2_overrides",
            "div_3_userjs", "div_4_other" ] );
          show(true, "outer", [ "div_1_2", "div_3_4" ] );
        }
        else if (div_name == "all-vertical") {
          show(true, "display", [ "div_1_template", "div_2_overrides",
            "div_3_userjs", "div_4_other" ] );
        }
        else {
          show(true, "display", [ div_name ] );
          document.getElementById(div_name).focus();
        }

        // collect mode + actions/overrides = focus overrides
        if (
          document.getElementById("collect_button").style.textDecoration == "line-through"
          && ( div_name == "actions_panel" || div_name == "div_2_overrides" )
        ) {
          // display overrides boxdiv
          if (div_name == "actions_panel") {
            // hide
            show(false, "inner", [ "div_1_template", "div_2_overrides",
              "div_3_userjs", "div_4_other" ] );
            show(false, "outer", [ "div_1_2", "div_3_4" ] );
            show(false, "button", [ "div_1_template_button",
              "div_3_userjs_button", "div_4_other_button", "all_button" ] );
            // show
            show(true, "display", [ "div_2_overrides" ] );
            show(true, "button", [ "div_2_overrides_button" ] );
          }
          // focus overrides input (as actions_panel is currently a smaller size)
          var e = document.getElementById("box_2_overrides");
          e.scrollIntoView();
          e.focus();
          // position cursor to the end
          e.selectionEnd = e.value.length;
          e.selectionStart = e.value.length;
        }

      }
    } /* end function togglePanel */

    function toggleActionsPanel(force) { togglePanel("actions_panel", force); }
    function toggleGroupsPanel(force) { togglePanel("groups_panel", force); }
    function toggleLinksPanel(force) { togglePanel("links_panel", force); }
    function toggleFunctionsPanel(force) { togglePanel("functions_panel", force); }
    function toggleHelpPanel(force) { togglePanel("help_panel", force); }
    function backButton(force) { togglePanel("back_button", force); }

    function toggleTemplateDiv() { togglePanel("div_1_template", true); }
    function toggleOverridesDiv() { togglePanel("div_2_overrides", true); }
    function toggleUserjsDiv() { togglePanel("div_3_userjs", true); }
    function toggleOtherDiv() { togglePanel("div_4_other", true); }
    function toggleAllDiv() { togglePanel("all", true); }
    function toggleAllDivVertical() { togglePanel("all-vertical", true); }

    function checkIfAllButtonSelected() {
      if (document.getElementById("all_button").style.borderWidth != '4px') {
        return false
      }
      return true
    }


    // *************************************
    // setExpandAll (expand/collapse all sections)
    // *************************************

    function setExpandAll(on = true) {
      var e = document.getElementsByClassName("content");
      if (e.length > 0) {
        for (var i=0, j=e.length; i<j; i++) {
          e[i].style.display = on ? "block" : "none";
        }
      }
    }


    // *************************************
    // setWrap (wrap text)
    // *************************************

    function setWrap(new_state) {
      // new_state: "toggle" (default) "on" "off" "refresh"
      var on = toggleSetWrapOnMenu(new_state);
      var e = document.getElementsByClassName("content");
      for (var i=0, j=e.length; i<j; i++) {
        e[i].style.whiteSpace = on ? "pre-wrap" : "pre";
      }
    }


    // *************************************
    // applyFontSize
    // *************************************

    /* font resize */

    function applyFontSize(size) {
      //var e = document.getElementById("view_area");
      var e = document.body;
      // size:  percent  increase/decrease amount  eg 100% -10 +10
      if (e.style.fontSize == "") {
        e.style.fontSize = "100%";
      }

      size = size.replace(/[% ]/g, "");
      if (/^-/.test(size)) {
        size = size.replace(/^-([0-9]+)$/, "$1");
        size = (parseFloat(e.style.fontSize) - parseFloat(size));
      }
      else if (/^\+/.test(size)) {
        size = size.replace(/^\+([0-9]+)$/, "$1");
        size = (parseFloat(e.style.fontSize) + parseFloat(size));
      }

      // half some top button size on larger font size
      // if (size > 200) {
      //   for (const id of [ "groups_button" ]) {
      //     document.getElementById(id).style.width = "2.5em";
      //   }
      // }
      // else if (parseFloat(e.style.fontSize) > 200) {
      //   // re-show the extra button
      //   for (const id of [ "groups_button" ]) {
      //     document.getElementById(id).style.width = "5em";
      //   }
      // }

      e.style.fontSize = size + "%";
      // update select element first option text to show the new percent
      document.getElementById("size_select").options[0].textContent
        = "\u25BE" + e.style.fontSize;
    }


    // *************************************
    // addThemeClass
    // *************************************

    /* change color theme */

    function addThemeClass(type, name, remove, add) {
      // get elements
      var e;
      if (type == "body") {
        e = document.body;
      }
      else if (type == "id") {
        e = document.getElementById(name);
      }
      else if (type == "tag") {
        e = document.getElementsByTagName(name);
      }
      else if (type == "class") {
        e = document.getElementsByClassName(name);
      }

      // remove/apply class to elements
      if (type == "body"||type == "id") {
        if (remove) { changeClass(e, name + "_" + remove, ""); }
        if (add) { changeClass(e, "", name + "_" + add); }
      }
      else {
        for (var i=0,j=e.length;i<j;i++) {
          if (remove) { changeClass(e[i], name + "_" + remove, ""); }
          if (add) { changeClass(e[i], "", name + "_" + add); }
        }
      }
    }

    // *************************************
    // applyTheme
    // *************************************

    function applyTheme(newtheme) {
      // remove any prefix eg "Theme: dark" = "dark"
      newtheme = newtheme.toLowerCase().replace( /^[^:]+: /, '');
      // get current theme from body class eg "body_light" = "light"
      var oldtheme = document.body.className.replace( /(^| *)[^_]+_/ , '');
      // usage: addThemeClass(type, name, remove, add)
      // eg addThemeClass("id", "view_area", "light", "dark")
      //    removes class view_area_light from id=view_area adds view_area_dark
      addThemeClass("body" , "body"     , oldtheme, newtheme);
      addThemeClass("id"   , "view_area", oldtheme, newtheme);
      addThemeClass("class", "view_area", oldtheme, newtheme);
      addThemeClass("class", "panels"   , oldtheme, newtheme);
      addThemeClass("class", "controls" , oldtheme, newtheme);
      addThemeClass("class", "borders"  , oldtheme, newtheme);
      invertColorForClass("overrides");
      updateMenuSelectOption("theme: " + oldtheme, false);
      updateMenuSelectOption("theme: " + newtheme, true);
    }

    // *************************************
    // selectTextAreaContents
    // *************************************

    /* functions used for actions panel options */

    function selectTextAreaContents(text_box_name) {
      var e = document.getElementById(text_box_name);
      if (e.selectionStart == 0 && e.selectionEnd == e.value.length) {
        // all text is selected already, so move cursor to end
        e.selectionEnd = e.value.length;
        e.selectionStart = e.value.length;
      }
      else {
        e.select();
      }
      e.focus();
    }


    // *************************************
    // toggleTextAreaReadOnly
    // *************************************

    function toggleTextAreaReadOnly(text_box_name, force, falseifempty = true) {
      var e = document.getElementById(text_box_name);
      var d = document.getElementById(text_box_name + "_ro")
      if (
        (falseifempty && e.value.replace(/[\r\n\t ]/g,"") == "")
        || (force === false)
        || ((force !== true) && (e.readOnly == true))
      ) {
        e.readOnly = false;
        d.innerHTML = d.innerHTML.replace(/\u{25A3}/u, "\u25A2");
      }
      else {
        e.readOnly = true;
        d.innerHTML = d.innerHTML.replace(/\u{25A2}/u, "\u25A3");
      }
    }


    // *************************************
    // readOnlySelectTextAreaContents
    // *************************************

    function readOnlySelectTextAreaContents(text_box_name) {
      var e = document.getElementById(text_box_name);
      toggleTextAreaReadOnly(text_box_name, true);
      e.select();
      e.focus();
    }


    // *************************************
    // clearTextAreaContents
    // *************************************

    function clearTextAreaContents(text_box_name) {
      var e = document.getElementById(text_box_name);
      e.value = "";
      e.style.backgroundColor = null; /*reset to initial*/
      toggleTextAreaReadOnly(text_box_name, false);
      // e.focus();
    }

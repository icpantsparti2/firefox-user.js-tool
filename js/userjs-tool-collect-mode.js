// Name         : userjs-tool-collect-mode.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // clickActionForCollectMode
    // *************************************

    /* collect mode - add/amend pref to collected output */

    function clickActionForCollectMode() {
      var output_box = document.getElementById("box_2_overrides");
      var prefstatus, prefName, prefValue, quote_type = "";
      var new_value = null, new_inactive = null;
      var x, x2, r;

      // prefstatus was clicked eg active=user_pref, inactive=// user_pref
      // toggle active/inactive (without prefValue change)
      if (/pref/.test(this.className)) {
        prefstatus = this;
        prefName = prefstatus.nextElementSibling;
        prefValue = prefName.nextElementSibling;
        if (/^[ \t]*(\/\/|\/\*)[ \t]*user_pref/.test(prefstatus.innerHTML)) {
          // inactive to active
          new_inactive = "";
          prefstatus.innerHTML = "user_pref"
        }
        else {
          // active to inactive
          new_inactive = "// ";
          prefstatus.innerHTML = "// user_pref"
        }
        // underline "user_pref" or "// user_pref" to indicate change
        prefstatus.style.textDecoration = "underline";
      }

      // prefValue was clicked
      else {
        prefValue = this;
        prefName = prefValue.previousElementSibling;
        prefstatus = prefName.previousElementSibling;

        // only if user_pref is active (as in not // commented)
        if (!(/^[ \t]*(\/\/|\/\*)[ \t]*user_pref/.test(prefstatus.innerHTML))) {

          // toggle boolean, others prompt edit (remove quotes on strings first)
          if (/true/.test(prefValue.className)) {
            new_value = "false";
            prefValue.className = prefValue.className.replace(/true/, "false");
          }
          else if (/false/.test(prefValue.className)) {
            new_value = "true";
            prefValue.className = prefValue.className.replace(/false/, "true");
          }
          else {
            // string and integer
            if (/string/.test(prefValue.className)) {
              quote_type = prefValue.innerHTML[0];
              if (!(quote_type == "'" || quote_type == '"')) { quote_type = "" }
              else {
              }
              // remove quotes
              new_value = prefValue.innerHTML.replace(/^["'](.*)["']$/,"$1");
            }
            else {
              new_value = prefValue.innerHTML;
            }
            // show edit box (you get null if canceled)
            new_value = prompt("Please amend the value", new_value);
          }

          // validate (add quotes on strings)
          if (new_value != null) {
            if (/string/.test(prefValue.className)) {
              prefValue.innerHTML = quote_type + new_value + quote_type;
            }
            else if (/integer/.test(prefValue.className)) {
              if (Number.isInteger(Number(new_value))) {
                prefValue.innerHTML = new_value;
              }
              else {
                new_value = null;
              }
            }
            else {
              prefValue.innerHTML = new_value;
            }
            if (new_value != null) {
              // underline value to indicate change
              prefValue.style.textDecoration = "underline";
            }
          }

        } /* end if (that stops edit of inactive prefs) */
      }

      // add to list of changes (kept in box_2_overrides)
      if (new_value != null || new_inactive != null) {

        x = new RegExp("user_pref[ \t]*\\([ \t]*[\"']"
          + RegExp.escape(prefName.innerHTML) + "[\"']", "m");

        x2 = new RegExp("^[ \t]*\/\/\/\/ --- comment-out --- '"
          + RegExp.escape(prefName.innerHTML) + "'", "m");

        if (new_inactive == "" || new_inactive == null) {
          // ie: r will be: user_pref("name", value);
          r = "user_pref(\"" + prefName.innerHTML + "\", "
            + prefValue.innerHTML + ");";
        }
        else {
          r = "//// --- comment-out --- '" + prefName.innerHTML + "'";
        }

        if (
          x.test(output_box.value)
          || x2.test(output_box.value)
        ) {
          // existing in output - do a find and replace
          //   keep any succeeding comment

          x = new RegExp("^.*user_pref[ \t]*\\([ \t]*[\"']"
            + RegExp.escape(prefName.innerHTML) + "[\"']"
            + "[ \t]*,[ \t]*(.*)[ \t]*\\)[ \t]*;"
            + "(.*)$", "gm");
          // use "$2 // $1" if you want previous prefValue
          output_box.value =
            output_box.value.replace(x,r + "$2");

          x2 = new RegExp("^[ \t]*\/\/\/\/ --- comment-out --- '"
            + RegExp.escape(prefName.innerHTML) + "'(.*)$", "gm");
          output_box.value =
            output_box.value.replace(x2,r + "$1");
        }
        else {
          // new to output
          output_box.value += r + "\n";
        }

        // get index of prefName within text box
        var ns = output_box.value.lastIndexOf('"' + prefName.innerHTML + '"');
        if (ns == -1) {
          ns = output_box.value.lastIndexOf("'" + prefName.innerHTML + "'");
        }

        var ne = ns;
        if (ns != -1) {
          ns = ns + 1;
          ne = ns + prefName.innerHTML.length;
        }

        // set focus to that location
        if (ns != -1) {
          output_box.scrollIntoView();
          output_box.select;
          output_box.selectionEnd = ne;
          output_box.selectionStart = ns;
          // it loses focus despite next line
          output_box.focus();
        }
      }
    }  /* end function clickActionForCollectMode */


    // *************************************
    // addEventListenersForCollectMode
    // *************************************

    function addEventListenersForCollectMode() {
      // https://stackoverflow.com/questions/37255293/getelementsbyclassname-with-two-classes
      var class1 = Array.from(document.getElementsByClassName("true"));
      var class2 = Array.from(document.getElementsByClassName("false"));
      var class3 = Array.from(document.getElementsByClassName("integer"));
      var class4 = Array.from(document.getElementsByClassName("string"));
      var class5 = Array.from(document.getElementsByClassName("pref"));
      var e = Array.from(new Set(class1.concat(class2,class3,class4,class5)));
      for (var i=0,j=e.length;i<j;i++) {
        e[i].style.cursor = "cell";
        e[i].addEventListener("click", clickActionForCollectMode);
      }
    }


    // *************************************
    // removeEventListenersForCollectMode
    // *************************************

    function removeEventListenersForCollectMode() {
      // https://stackoverflow.com/questions/37255293/getelementsbyclassname-with-two-classes
      var class1 = Array.from(document.getElementsByClassName("true"));
      var class2 = Array.from(document.getElementsByClassName("false"));
      var class3 = Array.from(document.getElementsByClassName("integer"));
      var class4 = Array.from(document.getElementsByClassName("string"));
      var class5 = Array.from(document.getElementsByClassName("pref"));
      var e = Array.from(new Set(class1.concat(class2,class3,class4,class5)));
      for (var i=0,j=e.length;i<j;i++) {
        e[i].style.cursor = "auto";
        e[i].removeEventListener("click", clickActionForCollectMode);
      }
    }

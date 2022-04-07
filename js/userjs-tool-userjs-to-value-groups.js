// Name         : userjs-tool-userjs-to-value-groups.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // userjsToValueGroups
    // *************************************

    function userjsToValueGroups(input_box_name, output_box_name) {
      var input_box = document.getElementById(input_box_name);
      var output_box = document.getElementById(output_box_name);
      output_box.value = '';
      var prefArray = [];

      // each id in valueGroups gets unique incrementing index
      var valueGroups = {
        'bfa': { 'id': 0, 'count': 0, 'name': "active boolean false" },
        'bta': { 'id': 0, 'count': 0, 'name': "active boolean true" },
        'i0a': { 'id': 0, 'count': 0, 'name': "active integer 0" },
        'i1a': { 'id': 0, 'count': 0, 'name': "active integer 1" },
        'i2a': { 'id': 0, 'count': 0, 'name': "active integer 2" },
        // 'i3a': { 'id': 0, 'count': 0, 'name': "active integer 3" },
        'ixa': { 'id': 0, 'count': 0, 'name': "active integer other" },
        'sea': { 'id': 0, 'count': 0, 'name': "active string empty" },
        'sxa': { 'id': 0, 'count': 0, 'name': "active string other" },
        'zza': { 'id': 0, 'count': 0, 'name': "active invalid" },
        'bfi': { 'id': 0, 'count': 0, 'name': "inactive boolean false" },
        'bti': { 'id': 0, 'count': 0, 'name': "inactive boolean true" },
        'i0i': { 'id': 0, 'count': 0, 'name': "inactive integer 0" },
        'i1i': { 'id': 0, 'count': 0, 'name': "inactive integer 1" },
        'i2i': { 'id': 0, 'count': 0, 'name': "inactive integer 2" },
        // 'i3i': { 'id': 0, 'count': 0, 'name': "inactive integer 3" },
        'ixi': { 'id': 0, 'count': 0, 'name': "inactive integer other" },
        'sei': { 'id': 0, 'count': 0, 'name': "inactive string empty" },
        'sxi': { 'id': 0, 'count': 0, 'name': "inactive string other" },
        'zzi': { 'id': 0, 'count': 0, 'name': "inactive invalid" }
      }
      var idinc=1;
      Object.keys(valueGroups).forEach(function(key){
        valueGroups[key].id = idinc++;
      });

      // add dividers to prefArray
      Object.keys(valueGroups).forEach(function(key){
        if (valueGroups[key].id > 0) {
          prefArray.push( {
            'group': valueGroups[key].id,
            'name': "", 'state': "-", 'value': "-", 'line': "",
            'hidden': false, 'count': 0
          } );
        }
      });

      var user_pref_regex = new RegExp(
        "^([ \t]*user_pref|.*//.*user_pref)"  // $1 user_pref  //user_pref  etc
        + "([ \t]*\\([ \t]*[\"'])"     // $2 ("  ('
        + "([^\"']+)"                  // $3 prefname
        + "([\"'][ \t]*,[ \t]*)"       // $4 ",  ',
        + "(.*)"                       // $5 prefvalue  "prefvalue"  'prefvalue'
        + "([ \t]*\\)[ \t]*;)"         // $6 );
        + "(.*)$", "gi"                // $7 afters/comment
      );

      var line, prefState, prefName, prefValue, prefComment, found, ic = 0;

      // convert in-block comments to in-line (improves inactive pref recognition)
      var input_content = amendCodeComments(input_box.value, true)
        .replace(/(\r\n|\r)/g,'\n').split("\n");

      // read user_pref into prefArray
      for (ic in input_content) {
        line = input_content[ic];
        if (user_pref_regex.test(line)) {
          prefState = line.replace(user_pref_regex, "$1");
          prefName = line.replace(user_pref_regex, "$3");
          prefValue = line.replace(user_pref_regex, "$5");
          prefComment = line.replace(user_pref_regex, "$7");
          if (new RegExp("^.*[/][/*].*user_pref", "i").test(prefState)) {
            prefState = "//";
          }
          else {
            prefState = "";
          }
          // check if already in the results array
          found=-1;
          for (var j = 0, len = prefArray.length; j < len; j++) {
            if (prefArray[j].name == prefName) {
              found = j;
              break;
            }
          }
          // update or add to the results array
          if (found > -1) {
            // new pref replaces previous if new=active or previous=inactive
            if ( (prefState == '') || (prefArray[found].state != '') ) {
              prefArray[found].state = prefState;
              prefArray[found].value = prefValue;
              prefArray[found].line = line;
              if (/hidden/i.test(prefComment)) {
                prefArray[found].hidden = true;
              }
              // and append ////{#count: previous}
              // prefArray[found].line =
              //   line + '    ////{#' + prefArray[found].count + ': '
              //   + prefArray[found].line
              //     .replace(/^(.*)user_pref\("[^"]+", *(.*)\);(.*)/, "$1$2$3")
              //   + '}';
            }
            prefArray[found].count ++;
          }
          else {
            // add
            prefArray.push( {
              'group': 0,
              'name': prefName,
              'state': prefState,
              'value': prefValue,
              'line': line,
              'hidden': (/hidden/i.test(prefComment) ? true : false),
              'count': 1,
            } );
          }
        }
      }
      input_content = [];

      // allocate value groups (and add count to line end if >1)
      var groupBase = "", groupSuffix = "";
      for (var i = 0, len = prefArray.length; i < len; i++) {
        if (prefArray[i].state != "-") {
          if (prefArray[i].state == '//') { groupSuffix = "i" }
          else { groupSuffix = "a" }
          if (prefArray[i].value == "false") { groupBase = "bf"; }
          else if (prefArray[i].value == "true") { groupBase = "bt"; }
          else if (prefArray[i].value == "0") { groupBase = "i0"; }
          else if (prefArray[i].value == "1") { groupBase = "i1"; }
          else if (prefArray[i].value == "2") { groupBase = "i2"; }
          // else if (prefArray[i].value == "3") { groupBase = "i3"; }
          else if (new RegExp("^[0-9.+-]+$").test(prefArray[i].value)) {
            groupBase = "ix"; // integer other
          }
          else if (new RegExp("^[\"'][\"']$").test(prefArray[i].value)) {
            groupBase = "se"; // string empty
          }
          else if (new RegExp("^[\"'].*[\"']$").test(prefArray[i].value)) {
            groupBase = "sx"; // string other
          }
          else {
            groupBase = "zz"; // invalid
          }
          valueGroups[groupBase + groupSuffix].count++;
          prefArray[i].group = valueGroups[groupBase + groupSuffix].id;
        }
        // add count and hidden for multiple occurance
        if (prefArray[i].count > 1) {
          prefArray[i].line += '  //// (x' + prefArray[i].count
            + (prefArray[i].hidden ? " [HIDDEN PREF]?" : "") + ')';
        }
      }

      // sort
      prefArray.sort((a, b) => a.name.localeCompare(b.name));
      prefArray.sort((a, b) => a.group - b.group);

      // output
      updateDateTimeStampVariable();
      var activeTitleNeeded = true, inactiveTitleNeeded = true;
      for (var i = 0, len = prefArray.length; i < len; i++) {
        if (prefArray[i].state == "-") {
          // output title
          Object.keys(valueGroups).forEach(function(key){
            // find the valueGroups that matches the title
            if (prefArray[i].group == valueGroups[key].id) {
              // output active/inactive heading (if not already done)
              if ( (activeTitleNeeded)
                && (/^active/.test(valueGroups[key].name)) )
              {
                output_box.value =
                  "/*** __________ " + date_time_stamp + " active user_pref"
                  + " grouped by values (no repeats) __________ ***/\n";
                activeTitleNeeded = false;
              }
              if ( (inactiveTitleNeeded)
                && (/^inactive/.test(valueGroups[key].name)) )
              {
                output_box.value +=
                  "\n/*** __________ " + date_time_stamp + " inactive user_pref"
                  + " grouped by values (no repeats) __________ ***/\n";
                inactiveTitleNeeded = false;
              }
              // output title
              output_box.value += "\n/*** " + valueGroups[key].name
                + " (" + valueGroups[key].count + ") ***/\n"
            }
          });
        }
        else {
          // output user_pref
          output_box.value += prefArray[i].line +"\n"
        }
      }

    } /* end function userjsToValueGroups */

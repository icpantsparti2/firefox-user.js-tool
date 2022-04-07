// Name         : userjs-tool-userjs-compare.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // userjsCompareLauncher
    // *************************************

    function userjsCompareLauncher(choice) {
      // choice eg  compare:1:4  compare:1:4:az:2column  etc
      // determine the box numbers to compare from the choice text
      var box1st = choice.replace(/^[^0-9]*([0-9])[^0-9]+([0-9]).*$/, "$1");
      var box2nd = choice.replace(/^[^0-9]*([0-9])[^0-9]+([0-9]).*$/, "$2");
      // groupx6 groupx12 multiple az unsorted diffstring
      var show = choice.replace(/^[^0-9]*([0-9])[^0-9]+([0-9]):([^:]+).*$/, "$3");
      // 5column 3column 2column
      var layout = choice.replace(/^[^0-9]*([0-9])[^0-9]+([0-9]):([^:]*):([^:]+).*$/, "$4");
      switch (box1st) {
        case "1": box1st="box_1_template"; break;
        case "2": box1st="box_2_overrides"; break;
        case "3": box1st="box_3_userjs"; break;
        case "4": box1st="box_4_other"; break;
      }
      switch (box2nd) {
        case "1": box2nd="box_1_template"; break;
        case "2": box2nd="box_2_overrides"; break;
        case "3": box2nd="box_3_userjs"; break;
        case "4": box2nd="box_4_other"; break;
      }
      if (
        document.getElementById("collect_button").style.textDecoration != "line-through"
        && ( !(document.getElementById(box1st).value == "")
          || !(document.getElementById(box2nd).value == "") )
      ) {
        if ( (document.getElementById(box1st).value == "")
          || (document.getElementById(box2nd).value == "")
          || (box1st == box2nd)
        ) {
          // trying to compare with empty/same box (ie just one box)
          if (!show || show == choice) { show = "az" }
        }
        else {
          if (!show || show == choice) { show = "groupx6" }
        }
        if (!layout || layout == choice) { layout = "5column" }
        userjsCompare(box1st, box2nd, show, layout);
        toggleActionsPanel(false);
      }
    } /* end function userjsCompareLauncher */


    // *************************************
    // userjsCompare
    // *************************************

    function userjsCompare(input_box_name, input_box_name_2, show, layout) {

      var input_box = document.getElementById(input_box_name);
      var input_box_2 = document.getElementById(input_box_name_2);

      // eg  "box_1" instead of "box_1_template"
      var input_box_short_name = input_box_name.replace(/_[a-z]+$/, "");
      var input_box_short_name_2 = input_box_name_2.replace(/_[a-z]+$/, "");
      if (input_box_name == input_box_name_2) {
        input_box_short_name_2 = "n/a";
      }

      var theme = document.body.className.replace( /(^| *)[^_]+_/ , '');

      var content_html = ""

        + '<div id="compare_buttons_bar">'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_groupx6_button" '
        + 'title="Group by value/state">Group x6</button>'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_groupx12_button" '
        + 'title="Group by value/state/active/inactive">Group x12</button>'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_multiple_button" '
        + 'title="Group by multiple occurrence/alphabetical">Multiple</button>'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_az_button" '
        + 'title="Group by alphabetical">A-Z</button>'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_unsorted_button" '
        + 'title="Group by order found">Unsorted</button>'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_diffstring_button" '
        + 'title="Show string difference">DiffStr</button>'

        + '<button type="button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" id="compare_layout_button" '
        + 'title="" style="margin-right:0.5em;">Layout</button>'

        + '<br>'

        // ref: http://www.amp-what.com/unicode/search/triangle

        + '<button type="button" id="jumpback_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" style="width:1.9em;min-width:1.9em;" '
        + 'title="Jump back a section">&#9650;</button>'

        + '<button type="button" id="jumpnext_button" class="controls borders'
        + ' controls_' + theme + ' borders_' + theme
        + '" style="width:1.9em;min-width:1.9em;margin-right:0.5em;" '
        + 'title="Jump to next section">&#9660;</button>'

        + '<input type="range" id="viewer_slider" min="0" max="50" value="0">'
        + '</div>'
        + '<div style="width: 100%;" id="compare_div">'

        + '<br><br><br><br>Compare ';

      switch (show) {
        case "groupx6":
          content_html += "[Group x6] (value/state)";
          break;
        case "groupx12":
          content_html += "[Group x12] (value/state/active/inactive)";
          break;
        case "multiple":
          content_html += "[Multiple] (multiple occurrence/alphabetical)";
          break;
        case "az":
          content_html += "[A-Z] (alphabetical)";
          break;
        case "unsorted":
          content_html += "[Unsorted] (order found)";
          break;
        case "diffstring":
          content_html += "[DiffStr] (string difference)"
            + "<br><br>&nbsp;&nbsp;(Uses a 3rd party library, see Help/Acknowledgments)"
            + "<br>&nbsp;&nbsp;(It is better to use file comparison software, eg meld)"
            + '<br><br>(<ins>1st</ins>: ' + input_box_short_name + ')'
            + '&nbsp;&nbsp;(<del>2nd</del>: ' + input_box_short_name_2 + ')<hr>';
          break;
        default:
          show = "az";
          content_html += "[A-Z] (alphabetical)";
      }

      if (show != "diffstring") {
        switch (layout) {
          case "5column":
            content_html += ' [Layout: 5 column]<br><br>';
            break;
          case "3column":
            content_html += ' [Layout: 3 column]<br><br>';
            break;
          case "2column":
            content_html += ' [Layout: 2 column]<br><br>';
            break;
          default:
            layout = "5column";
            content_html += ' [Layout: 5 column]<br><br>';
        }
      }

      var index_select_html = ''
        + '<option value="" disabled selected hidden>&#x25BE;Index</option>\n'
        + '<option value="0">(TOP)</option>\n';

      var groups_container_html = '';

      var sectionCount = 0;

      if (show == "diffstring") {

        ////////////////////////////////////////
        // diffString (userjsCompare)
        ////////////////////////////////////////

        sectionCount++;
        // diffString(old, new)
        content_html +=
          '<span class="anchor" id="1"></span>'
          + '<div id=diffstr_area>'
          + escapeHtml(diffString(input_box_2.value, input_box.value))
            .replace(/&lt;del&gt;/g, "<del>")
            .replace(/&lt;\/del&gt;/g, "</del>")
            .replace(/&lt;ins&gt;/g, "<ins>")
            .replace(/&lt;\/ins&gt;/g, "</ins>")
          + '</div>'
          + '<span class="anchor" id="2"></span></div>\n';
        sectionCount++;

      }
      else {

        ////////////////////////////////////////
        // read content into an array (userjsCompare)
        ////////////////////////////////////////

        var prefArray = [];

        // id values get dynamically set after this variable
        //   (then id > 0 will have sub-sections/links)
        // id defaults for groupx12 view (-1 is no sub-section)
        // id value of 0 will be replaced with unique incremental number
        var stats = {
          'total': { 'id': -2, 'sub': false, 'count': 0, 'name': "Combined total" },
          'multiple1+2': { 'id': -2, 'sub': true, 'count': 0, 'name': "Multiple occurrence in 1st and 2nd" },
          'multiple1': { 'id': -2, 'sub': true, 'count': 0, 'name': "Multiple occurrence in 1st (single or not in 2nd)" },
          'multiple2': { 'id': -2, 'sub': true, 'count': 0, 'name': "Multiple occurrence in 2nd (single or not in 1st)" },
          'nomultiple1+2': { 'id': -2, 'sub': true, 'count': 0, 'name': "Remainder (without multiples) in 1st and 2nd" },
          'nomultiple1': { 'id': -2, 'sub': true, 'count': 0, 'name': "Remainder (without multiples) in 1st" },
          'nomultiple2': { 'id': -2, 'sub': true, 'count': 0, 'name': "Remainder (without multiples) in 2nd" },
          'total1': { 'id': -2, 'sub': false, 'count': 0, 'name': "In 1st" },
          'total1a': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 1st - active " },
          'total1i': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 1st - inactive" },
          'total1m': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 1st &amp; multiple occurrence" },
          'total1s': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 1st &amp; single occurrence" },
          'total2': { 'id': -2, 'sub': false, 'count': 0, 'name': "In 2nd" },
          'total2a': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 2nd - active" },
          'total2i': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 2nd - inactive" },
          'total2m': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 2nd &amp; multiple occurrence" },
          'total2s': { 'id': -2, 'sub': true,  'count': 0, 'name': "In 2nd &amp; single occurrence" },
          'match+': { 'id': -1, 'sub': false, 'count': 0, 'name': "Value:match &amp; State:match" },
          'match+a': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:match &amp; State:match - active" },
          'match+i': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:match &amp; State:match - inactive" },
          'match-': { 'id': -1, 'sub': false, 'count': 0, 'name': "Value:match &amp; State:differ" },
          'match-a': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:match &amp; State:differ - active in 1st" },
          'match-i': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:match &amp; State:differ - inactive in 1st" },
          'differ+': { 'id': -1, 'sub': false, 'count': 0, 'name': "Value:differ &amp; State:match" },
          'differ+a': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:differ &amp; State:match - active" },
          'differ+i': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:differ &amp; State:match - inactive" },
          'differ-': { 'id': -1, 'sub': false, 'count': 0, 'name': "Value:differ &amp; State:differ" },
          'differ-a': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:differ &amp; State:differ - active in 1st" },
          'differ-i': { 'id': 0, 'sub': true, 'count': 0, 'name': "Value:differ &amp; State:differ - inactive in 1st" },
          'only1': { 'id': -1, 'sub': false, 'count': 0, 'name': "Only in 1st" },
          'only1a': { 'id': 0, 'sub': true,  'count': 0, 'name': "Only in 1st - active" },
          'only1i': { 'id': 0, 'sub': true,  'count': 0, 'name': "Only in 1st - inactive" },
          'only2': { 'id': -1, 'sub': false, 'count': 0, 'name': "Only in 2nd" },
          'only2a': { 'id': 0, 'sub': true,  'count': 0, 'name': "Only in 2nd - active" },
          'only2i': { 'id': 0, 'sub': true,  'count': 0, 'name': "Only in 2nd - inactive" }
        }

        // set id for sub-sections we want (depending on view required)
        if (show == "groupx12") {
          // want those with default id of 0
          var idinc=1;
          Object.keys(stats).forEach(function(key){
            if (stats[key].id == 0) { stats[key].id = idinc++; }
          });
        }
        else if (show == "groupx6") {
          // want those with default id of -1
          var idinc=1;
          Object.keys(stats).forEach(function(key){
            if (stats[key].id == -1) {
              stats[key].id = idinc++; }
            else {
              stats[key].id = -1; }
          });
        }
        else if (show == "unsorted") {
          // first set all -1 (off), then index what we need
          var idinc=1;
          Object.keys(stats).forEach(function(key){
            if (stats[key].id == 0) { stats[key].id = -1; }
            if (key == "total1" || key == "only2") {
              stats[key].id = idinc++;
            }
          });
        }
        else if (show == "multiple") {
          // first set all -1 (off), then index what we need
          var idinc=1;
          Object.keys(stats).forEach(function(key){
            if (stats[key].id == 0) { stats[key].id = -1; }
            if (
              key == "multiple1+2" || key == "multiple1"
              || key == "multiple2" || key == "nomultiple1+2"
              || key == "nomultiple1" || key == "nomultiple2"
            ) {
              stats[key].id = idinc++;
            }
          });
        }
        else {
          // a-z
          // first set all -1 (off), then index what we need
          var idinc=1;
          Object.keys(stats).forEach(function(key){
            if (stats[key].id == 0) { stats[key].id = -1; }
            if ( key == "total" ) {
              stats[key].id = idinc++;
            }
          });
        }


        // add dividers to prefArray

        Object.keys(stats).forEach(function(key){
          if (stats[key].id > 0) {
            prefArray.push( {
              'diff': stats[key].id, 'name': "",
              'state1': "-", 'value1': "-", 'count1': 0,
              'state2': "-", 'value2': "-", 'count2': 0
            } );
          }
        });

        var user_pref_regex =  new RegExp(
          "^([ \t]*user_pref|.*//.*user_pref)"  // $1 user_pref  //user_pref  etc
          + "([ \t]*\\([ \t]*[\"'])"     // $2 ("  ('
          + "([^\"']+)"                  // $3 prefname
          + "([\"'][ \t]*,[ \t]*)"       // $4 ",  ',
          + "(.*)"                       // $5 prefvalue  "prefvalue"  'prefvalue'
          + "([ \t]*\\)[ \t]*;)"         // $6 );
          + "(.*)$", "gi"                // $7 afters/comment
        );

        var line, prefState, prefName, prefValue, found, ic = 0;

        ////////////////////////////////////////
        // add 1st input to prefArray (userjsCompare)
        ////////////////////////////////////////

        // convert in-block comments to in-line (improves inactive pref recognition)
        var input_content = amendCodeComments(input_box.value, true)
          .replace(/(\r\n|\r)/g,'\n').split("\n");

        for (ic in input_content) {
          line = input_content[ic];
          if (user_pref_regex.test(line)) {
            prefState = line.replace(user_pref_regex, "$1");
            prefName = line.replace(user_pref_regex, "$3");
            prefValue = line.replace(user_pref_regex,"$5");
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
              if ( (prefState == '') || (prefArray[found].state1 != '') ) {
                prefArray[found].state1 = prefState;
                prefArray[found].value1 = prefValue;
              }
              prefArray[found].count1 ++;
            }
            else {
              // add
              prefArray.push( {
                'name': prefName,
                'diff': 0,
                'state1': prefState,
                'value1': prefValue,
                'count1': 1,
                'state2': "-",
                'value2': "-",
                'count2': 0
              } );
            }
          }
        }
        input_content = [];

        ////////////////////////////////////////
        // add 2nd input to prefArray (userjsCompare)
        ////////////////////////////////////////

        if (input_box_name == input_box_name_2) {
          // just viewing stats etc on one box
          input_content = [];
        }
        else {
          // convert in-block comments to in-line (improves inactive pref recognition)
          input_content = amendCodeComments(input_box_2.value, true)
            .replace(/(\r\n|\r)/g,'\n').split("\n");
        }

        for (ic in input_content) {
          line = input_content[ic];
          if (user_pref_regex.test(line)) {
            prefState = line.replace(user_pref_regex, "$1");
            prefName = line.replace(user_pref_regex, "$3");
            prefValue = line.replace(user_pref_regex,"$5");
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
              if ( (prefState == '') || (prefArray[found].state2 != '') ) {
                prefArray[found].state2 = prefState;
                prefArray[found].value2 = prefValue;
              }
              prefArray[found].count2 ++;
            }
            else {
              // add
              prefArray.push( {
                'name': prefName,
                'diff': 0,
                'state1': "-",
                'value1': "-",
                'count1': 0,
                'state2': prefState,
                'value2': prefValue,
                'count2': 1
              } );
            }
          }
        }
        input_content = [];

        ////////////////////////////////////////
        // calculate: differences and stats (userjsCompare)
        ////////////////////////////////////////

        var statBase = "", statSuffix = "";

        for (var i = 0, len = prefArray.length; i < len; i++) {

          stats["total"].count++;

          statBase = "total1";
          stats[statBase].count++;
          if (prefArray[i].state1 == '') {
            stats[statBase + "a"].count++;
          }
          else if (prefArray[i].state1 == '//') {
            stats[statBase + "i"].count++;
          }
          else { stats[statBase].count--; }
          if (prefArray[i].state1 != '-' && prefArray[i].count1 > 1) {
            stats[statBase + "m"].count++;
          }
          else if (prefArray[i].state1 != '-') {
            stats[statBase + "s"].count++;
          }

          statBase = "total2";
          stats[statBase].count++;
          if (prefArray[i].state2 == '') {
            stats[statBase + "a"].count++;
          }
          else if (prefArray[i].state2 == '//') {
            stats[statBase + "i"].count++;
          }
          else { stats[statBase].count--; }
          if (prefArray[i].state2 != '-' && prefArray[i].count2 > 1) {
            stats[statBase + "m"].count++;
          }
          else if (prefArray[i].state2 != '-') {
            stats[statBase + "s"].count++;
          }

          // title
          if (prefArray[i].state1 == "-" && prefArray[i].state2 == "-" ) {
            stats["total"].count--;
          }
          else {

            // present in 1 only
            if (prefArray[i].state2 == "-") {
              statBase = "only1";
              if (prefArray[i].state1 == '//') { statSuffix = "i" }
              else { statSuffix = "a" }
              // inc count
              stats[statBase].count++;
              stats[statBase + statSuffix].count++;
              prefArray[i].diff = stats[statBase + statSuffix].id;
              // adjust for these
              if (show == "unsorted") {
                prefArray[i].diff = stats["total1"].id;
              }
              else if (show == "groupx6") {
                prefArray[i].diff = stats[statBase].id;
              }
            }

            // present in 2 only
            else if (prefArray[i].state1 == "-") {
              statBase = "only2";
              if (prefArray[i].state2 == '//') { statSuffix = "i" }
              else { statSuffix = "a" }
              // inc count
              stats[statBase].count++;
              stats[statBase + statSuffix].count++;
              prefArray[i].diff = stats[statBase + statSuffix].id;
              // adjust for these
              if (show == "unsorted" || show == "groupx6") {
                prefArray[i].diff = stats[statBase].id; }
            }

            // present in both
            else {
              // note value: match or differ
              if ( prefArray[i].value1 == prefArray[i].value2 ) {
                statBase = "match";
              }
              else { statBase = "differ" }
              // note state: same (+) opposite (-)
              if (prefArray[i].state1 == prefArray[i].state2) {
                statBase += "+";
              }
              else { statBase += "-"; }
              // note state: inactive or active
              if (prefArray[i].state1 == '//') { statSuffix = "i" }
              else { statSuffix = "a" }
              // inc count
              stats[statBase].count++;
              stats[statBase + statSuffix].count++;
              prefArray[i].diff = stats[statBase + statSuffix].id;
              // adjust for these
              if (show == "unsorted") {
                prefArray[i].diff = stats["total1"].id;
              }
              else if (show == "groupx6") {
                prefArray[i].diff = stats[statBase].id;
              }
            }

            // multiple or no multiple occurrence
            if (prefArray[i].count1 > 1 || prefArray[i].count2 > 1) {
              statBase = "multiple"
              if (prefArray[i].count1 > 1 && prefArray[i].count2 > 1) {
                statSuffix = "1+2"; }
              else if (prefArray[i].count1 > 1) { statSuffix = "1"; }
              else { statSuffix = "2"; }
            }
            else {
              statBase = "nomultiple"
              if (prefArray[i].count1 == 1 && prefArray[i].count2 == 1) {
                statSuffix = "1+2"; }
              else if (prefArray[i].count1 == 1) { statSuffix = "1"; }
              else { statSuffix = "2"; }
            }
            stats[statBase + statSuffix].count++;
            if (show == "multiple") {
              prefArray[i].diff = stats[statBase + statSuffix].id; }

            if (show == "az") { prefArray[i].diff = stats["total"].id }

          }

        }

        ////////////////////////////////////////
        // sort (userjsCompare)
        ////////////////////////////////////////

        if (show != "unsorted") {
          prefArray.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (show != "az") {
          prefArray.sort((a, b) => a.diff - b.diff);
        }

        ////////////////////////////////////////
        // add stats totals table (userjsCompare)
        ////////////////////////////////////////

        content_html += '<details><summary>Summary'
          + '&nbsp;&nbsp;(1st: ' + input_box_short_name + ')'
          + '&nbsp;&nbsp;(2nd: ' + input_box_short_name_2 + ')'
          + '</summary><br><table id="table_stats">'
          + '<colgroup><col width="10%" /><col width="10%" />'
          + '<col width="80%"/> </colgroup><tbody>';
        Object.keys(stats).forEach(function(key){
          content_html += '<tr><td class="td1_stats_count">';
          if (stats[key].sub) {
            // col1:empty col2:stat col3:name
            content_html += '</td><td class="td2_stats_count">';
            content_html += stats[key].count;
            content_html += '</td><td class="td3a_stats_name">';
          }
          else {
            // col1:stat col2+col3:name
            content_html += stats[key].count;
            content_html += '</td><td class="td3b_stats_name" colspan="2">';
          }
          if ( stats[key].id > 0 ) {
            // stat name as a link
            content_html += '<span class="anav http" id="#' + stats[key].id + '">';
            content_html += stats[key].name;
            content_html += ' [' + stats[key].id + ']' + '</span>';
            // add to the index_select button
            index_select_html += '<option value="' + stats[key].id
              + '">[' + stats[key].id + '] ' + stats[key].name
              + ' (' + stats[key].count + ')</option>\n';
          }
          else {
            // stat name as plain (no link)
            content_html += stats[key].name;
          }
          content_html += '</td></tr>';
        });
        content_html += "</tbody></table></details>";

        ////////////////////////////////////////
        // add results table (userjsCompare)
        ////////////////////////////////////////

        content_html += '<br><table id="table_comp">';


        // start: header row
        content_html += '<tr>';

        // 5col 3col (prefname col)
        if (layout != "2column") {
          content_html += '<td class="td_comp ';
          if (layout == "5column") {
            content_html += 'td1a_comp_name"';
          }
          else if (layout == "3column") {
            content_html += 'td1b_comp_name" rowspan="2"';
          }
          // add prefname column header
          content_html +=
            '>Preference Name<br>(Total: ' + stats["total"].count + ')</td>';
        }

        if (layout == "2column") {
          var td3td5 = 'td3td5_b_comp_value';
        }
        else {
          var td3td5 = 'td3td5_comp_value'
        }

        // 5col 3col 2col (state1 value1 cols)
        content_html +=
            '<td class="td_comp td2td4_comp_state">State1</td>'
          + '<td class="td_comp ' + td3td5 + '">Value1<br>('
          + input_box_short_name + ': ' + stats["total1"].count
          + ')</td>';
        // 3col 2col (split into 2nd row)
        if (layout != "5column") { content_html += '</tr><tr>' }

        // 5col 3col 2col (state2 value2 cols)
        content_html += '<td class="td_comp td2td4_comp_state">State2</td>'
          + '<td class="td_comp ' + td3td5 + '">Value2<br>('
          + input_box_short_name_2 + ': ' + stats["total2"].count
          + ')</td></tr>';
        // end: header row


        // each row
        var titlebm;
        var diff_state1, diff_value1, diff_state2, diff_value2;
        var section_heading = '(TOP)';
        var group_user_pref_list = '';
        groups_container_html +=
          '<a target="_blank" href="about:config?filter=/^\\*$|^(';

        for (var i = 0, len = prefArray.length; i < len; i++) {

          diff_state1 = " td_comp_diff";
          diff_value1 = " td_comp_diff";
          diff_state2 = " td_comp_diff";
          diff_value2 = " td_comp_diff";
          if (prefArray[i].state1 == prefArray[i].state2) {
            diff_state1 = "";
            diff_state2 = "";
          }
          if ( prefArray[i].value1 == prefArray[i].value2) {
            diff_value1 = "";
            diff_value2 = "";
          }
          if (prefArray[i].state1 == "-") { diff_state1 = ""; }
          if (prefArray[i].state2 == "-") { diff_state2 = ""; }
          if (prefArray[i].value1 == "-") { diff_value1 = ""; }
          if (prefArray[i].value2 == "-") { diff_value2 = ""; }

          // row/cell contents

          if (prefArray[i].state1 == "-" && prefArray[i].state2 == "-") {

            ////////////////////////
            // section heading row
            ////////////////////////

            sectionCount++;

            // name (title)
            content_html += '<tr><td class="td_comp ';
            if (layout == "5column") {
              content_html += 'td1a_comp_name" colspan="5">';
            }
            else if (layout == "3column") {
              content_html += 'td1b_comp_name td_comp_dashed" colspan="3">';
            }
            else if (layout == "2column") {
              content_html += 'td1b_comp_name td_comp_dashed" colspan="2">';
            }
            // anchor
            content_html +=
              '<br><span class="anchor" id="' + sectionCount + '"></span>';

            // add the title info
            // go through the stats type object
            // and find the one that matches the diff
            Object.keys(stats).forEach(function(key){
              if (prefArray[i].diff == stats[key].id) {
                // add: [#] name (count)
                content_html += '<span class="anav http" id="#' + prefArray[i].diff
                  + '">[' + prefArray[i].diff + "]</span>"
                  + " <b>" + stats[key].name + "</b>"
                  + "  (" + stats[key].count + ")<br><br>";
                // note name for [Groups] bookmark: [#] name (count)
                titlebm = "[" + prefArray[i].diff + "] "
                  + stats[key].name + " (" + stats[key].count + ")";
              }
            });

            content_html += '</td>';

            // end and start about:config bookmarks groups
            group_user_pref_list = group_user_pref_list.replace(/\|$/, '');
            groups_container_html += group_user_pref_list + ')(;|$)|^$/i">-'
              + section_heading + '</A><br>\n';
            group_user_pref_list = '';
            section_heading = titlebm;
            groups_container_html +=
              '<a target="_blank" href="about:config?filter=/^\\*$|^(';
          }
          else {

            /////////////////
            // user_pref row
            /////////////////

            // pref name
            content_html += '<tr>';

            // 5col 3col (prefname col)
            if (layout != "2column") {
              content_html += '<td class="td_comp '
              if (layout == "5column") {
                content_html += 'td1a_comp_name">';
              }
              else if (layout == "3column") {
                content_html += 'td1b_comp_name td_comp_dashed" rowspan="2">';
              }
              // add prefname
              content_html +=
                "<a target=\"_blank\" href=\"about:config?filter=/^\\*\$|^("
                + prefArray[i].name.replace(/([*.+])/g, "\\$1")
                + ")(;|\$)|^\$/i\">" + prefArray[i].name + "</a>";
              // if multiples show the count
              if ( prefArray[i].count1 > 1 || prefArray[i].count2 > 1) {
                content_html += ' (x' + prefArray[i].count1 + ' x'
                  + prefArray[i].count2 + ')</td>';
              }
            }

            group_user_pref_list +=
              prefArray[i].name.replace(/([*.+])/g, "\\$1") + "|";

            // 5col 3col 2col (state1 col)
            content_html += '<td class="td_comp td2td4_comp_state';
            if (layout != "5column") { content_html += ' td_comp_dashed'; }
            content_html +=
              diff_state1 + '">' + '<span class="pref">'
              + prefArray[i].state1 + '</span>' + '</td>';

            // 5col 3col 2col (value1 col)
            content_html += '<td class="td_comp ' + td3td5;
            if (layout != "5column") { content_html += ' td_comp_dashed'; }
            content_html += diff_value1 + '">';
            if ((layout == "2column") && (prefArray[i].value1 != "-")) {
              // add pref name
              content_html += 'user_pref("'
                + "<a target=\"_blank\" href=\"about:config?filter=/^\\*\$|^("
                + prefArray[i].name.replace(/([*.+])/g, "\\$1")
                + ")(;|\$)|^\$/i\">" + prefArray[i].name + "</a>"
                + '", ';
            }
            // add value1
            content_html += '<span class="'
              + prefArray[i].value1.replace(/^-$/, "pref")
                  .replace(/^[0-9.+-]+$/, "integer")
                  .replace(/^(".*"|'.*')$/, "string")
              + '">' + prefArray[i].value1 + '</span>';
            if ((layout == "2column") && (prefArray[i].value1 != "-")) {
              content_html += ');';
            }
            content_html += '</td>';
            if (layout != "5column") { content_html += '</tr>' + '<tr>'; }

            // state2
            content_html +=
              '<td class="td_comp td2td4_comp_state'
              + diff_state2 + '">' + '<span class="pref">'
              + prefArray[i].state2 + '</span>' + '</td>';

            // value2
            content_html += '<td class="td_comp ' + td3td5 + diff_value2 + '">';
            if ((layout == "2column") && (prefArray[i].value2 != "-")) {
              // add pref name
              content_html += 'user_pref("'
                + "<a target=\"_blank\" href=\"about:config?filter=/^\\*\$|^("
                + prefArray[i].name.replace(/([*.+])/g, "\\$1")
                + ")(;|\$)|^\$/i\">" + prefArray[i].name + "</a>"
                + '", ';
            }
            // add value2
            content_html += '<span class="'
              + prefArray[i].value2.replace(/^-$/, "pref")
                  .replace(/^[0-9.+-]+$/, "integer")
                  .replace(/^(".*"|'.*')$/, "string")
              + '">' + prefArray[i].value2 + '</span>';
            if ((layout == "2column") && (prefArray[i].value2 != "-")) {
              content_html += ');';
            }
            content_html += '</td>';

          }

          content_html += '</tr>';

        }
        sectionCount++;
        content_html +=
            '</table>'
          + '<span class="anchor" id="' + sectionCount + '"></span>'
          + '</div>';

        // end about:config bookmarks groups
        group_user_pref_list = group_user_pref_list.replace(/\|$/, '');
        groups_container_html += group_user_pref_list + ')(;|$)|^$/i">-'
          + section_heading + '</A><br>\n';

      }

      ////////////////////////////////////////
      // end content (userjsCompare)
      ////////////////////////////////////////

      content_html += '  <br><br><br>\n';
      index_select_html += '<option value="' + sectionCount
        + '">(BOTTOM)</option>\n';

      document.getElementById("view_area").innerHTML = content_html;
      document.getElementById("index_select").innerHTML = index_select_html;

      // also remove first group if unused
      document.getElementById("groups_container").innerHTML =
        groups_container_html.replace(new RegExp('<a target="_blank"'
          + ' href="about:config\\?filter='
          + '\\/\\^\\\\\\*\\$\\|\\^\\(\\)\\(;\\|\\$\\)\\|\\^\\$\\/i">'
          + '-\\(TOP\\)<\\/A><br>'), "");

      content_html = null;
      index_select_html = null;
      groups_container_html = null;

      scroll(0,0);

      document.getElementById("compare_" + show + "_button").style.borderWidth = '4px';
      document.getElementById("compare_" + show + "_button").style.fontWeight = 'bold';

      if (show == "diffstring") {
        // add class and invert <ins> diffs (leave <del> as strike through)
        var e = document.getElementsByTagName("ins");
        for (var i=0,j=e.length;i<j;i++) {
          changeClass(e[i], "", "invert");
        }
        invertColorForClass("invert");

        // hide layout button
        document.getElementById("compare_layout_button").style.display = "none";
      }

      document.getElementById("compare_unsorted_button").addEventListener("click", function() {
        userjsCompare(input_box_name, input_box_name_2, "unsorted", layout);
      });

      document.getElementById("compare_multiple_button").addEventListener("click", function() {
        userjsCompare(input_box_name, input_box_name_2, "multiple", layout);
      });

      document.getElementById("compare_az_button").addEventListener("click", function() {
        userjsCompare(input_box_name, input_box_name_2, "az", layout);
      });

      document.getElementById("compare_groupx6_button").addEventListener("click", function() {
        userjsCompare(input_box_name, input_box_name_2, "groupx6", layout);
      });

      document.getElementById("compare_groupx12_button").addEventListener("click", function() {
        userjsCompare(input_box_name, input_box_name_2, "groupx12", layout);
      });

      document.getElementById("compare_diffstring_button").addEventListener("click", function() {
        userjsCompare(input_box_name, input_box_name_2, "diffstring", layout);
      });

      document.getElementById("compare_layout_button").addEventListener("click", function() {
        if (layout == "5column") { layout = "3column" }
        else if (layout == "3column") { layout = "2column" }
        else { layout = "5column" }
        userjsCompare(input_box_name, input_box_name_2, show, layout);
      });

      // back
      document.getElementById("jumpback_button").addEventListener("click", function() {
        var e = document.getElementsByClassName("anchor");
        var id = 0;
        for (var i = 0, j = e.length; i<j; i++) {
          if (e[i].getBoundingClientRect().y >= 0) {
            break;
          }
          else {
            id = i + 1;
          }
        }
        document.getElementById("viewer_slider").value = id;
        if (id == 0) {
          scroll(0,0);
        }
        else {
          document.getElementById(id).scrollIntoView();
        }
      });

      // next
      document.getElementById("jumpnext_button").addEventListener("click", function() {
        var e = document.getElementsByClassName("anchor");
        var id = 1;
        for (var i = 0, j = e.length; i<j; i++) {
          if (e[i].getBoundingClientRect().y > 1) {
            break;
          }
          else {
            id = i + 2;
          }
        }
        document.getElementById("viewer_slider").value = id;
        if (id == 0) {
          scroll(0,0);
        }
        else {
          document.getElementById(id).scrollIntoView();
        }
      });

      // slider
      document.getElementById("viewer_slider").max = sectionCount;
      for (const event of [ "input", "click" ]) {
        document.getElementById("viewer_slider").addEventListener(event, function() {
          if (this.value == 0) {
            scroll(0,0);
          }
          else {
            document.getElementById(this.value).scrollIntoView();
          }
        });
      }

      // when the back next symbols are clicked update the nav slider
      var e = document.getElementsByClassName("anav");
      for (var i = 0, j = e.length; i<j; i++) {
        e[i].addEventListener("click", function() {
          var id = this.id.replace(/^.*#$/, "0").replace(/^.*#/, "");
          document.getElementById("viewer_slider").value = id;
          if (id == 0) {
            scroll(0,0);
          }
          else {
            document.getElementById(id).scrollIntoView();
          }
        });
      }

      togglePrefixAboutConfigLinks("refresh");
      if (toggleGroupsOnView("status")) { toggleGroupsPanel(true); }

    } /* end function userjsCompare */

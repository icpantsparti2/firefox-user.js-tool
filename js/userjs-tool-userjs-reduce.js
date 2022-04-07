// Name         : userjs-tool-userjs-reduce.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // userjsReduce
    // *************************************

    function userjsReduce(input_box_name, output_box_name, skeleton) {

      var input_box = document.getElementById(input_box_name);
      var output_box = document.getElementById(output_box_name);
      output_box.value = '';

      // convert in-block comments to in-line (improves inactive pref recognition)
      var input_content = amendCodeComments(input_box.value, true)
        .replace(/(\r\n|\r)/g,'\n').split("\n");

      var section_number_tag = "0000";
      var section_number_tag_9999_prefix = "";
      var userjs_type = "";
      updateDateTimeStampVariable();
      if (skeleton) {
        output_box.value += "// " + date_time_stamp + " skeleton\n\n";
        output_box.value += "/*** (overrides) (TOP) / Introduction ***/";
      }
      else {
        output_box.value += "// " + date_time_stamp + " reduced\n";
      }

      var i = 0;
      for (i in input_content) {
        var line = input_content[i];
        var x="",r="";

        if (skeleton) {
          if (line == "/*** (overrides) (TOP) / Introduction ***/") { continue; }
        }

        userjs_type = detectUserjsType(line, userjs_type, i);

        // pick up the arkenfox/user.js section number
        if (userjs_type == "arkenfox") {
          if (
            new RegExp("^\/\/ /[*/]+ +(START|END|[0-9][^:]+):").test(line)
            || new RegExp("^\/\/ /[*/]+ +\\[SECTION [^:]+:").test(line)
          ) {
            section_number_tag = line;
            x = new RegExp("^(?:\/\/ )/[*/]+ +\\[SECTION ([^\\]]+)\\]:.*$");
            section_number_tag = section_number_tag.replace(x, "$1");
            x = new RegExp("^(?:\/\/ )/[*/]+ +([^:]+):.*$");
            section_number_tag = section_number_tag.replace(x, "$1");
            if (/^9999/.test(section_number_tag)) {
              section_number_tag_9999_prefix = '9999:';
            }
            else if (/^END/.test(section_number_tag)) {
              section_number_tag_9999_prefix = '';
            }
          }
        }

        if (skeleton) {
          // prefix arkenfox/user.js parrot value
          x = new RegExp("^([ \t/*]*user_pref[ \t]*"
            + "\\([ \t]*[\"']_user\.js\.parrot[\"'][ \t]*,[ \t]*[\"'])"
            + "(.*)$");
          if (new RegExp("\\(overrides\\)").test(line) == false) {
            line = line.replace(x, "$1(overrides) $2");
          }
        }

        // prefix user_pref line with a temporary ##PREF## identifier
        line = line.replace("\/\/user_pref", "\/\/ user_pref");
        line = line.replace("\/\*user_pref", "\/* user_pref");
        x = new RegExp(
          "^[ \t]*"
          + "(user_pref|\/[\/\*].*user_pref)"
          + "[ \t]*" + "(\\()"
          + "[ \t]*" + "([\"'][^\"']+[\"'])"
          + "[ \t]*,[ \t]*" + "(.*)"
          + "[ \t]*" + "(\\))"
          + "[ \t]*" + "(;).*$");
        if (skeleton) {
          // comment the pref //
          line = line.replace(x, "##PREF##\/\/ $1$2$3, $4$5$6");
        }
        else {
          line = line.replace(x, "##PREF##$1$2$3, $4$5$6");
        }

        // keep section_heading or pref lines
        if ( detectSectionHeading(line, userjs_type, i) == true ) {
          line = tidySectionHeading(line, true);
          if (skeleton) {
            // output heading line (with '(overrides)' inserted)
            line = line.replace(new RegExp("^\\(overrides\\) "), "");
            output_box.value += "\n\n/*** (overrides) " + line + " ***/";
          }
          else {
            output_box.value += "\n\n/*** " + line + " ***/";
          }
        }
        else if (/^##PREF##/.test(line)) {
          // remove the prefix
          line = line.replace(new RegExp("^##PREF##"), "");

          if (skeleton) {
            // un-comment the arkenfox/user.js parrot
            x = new RegExp("^//[ \t/*]*(user_pref[ \t]*"
              + "\\([ \t]*[\"']_user\.js\.parrot[\"'][ \t]*,[ \t]*[\"'].*)$");
            line = line.replace(x, "$1");
          }

          // output user_pref line (and add section number if arkenfox)
          output_box.value += "\n" + line;
          if (userjs_type == "arkenfox") {
            output_box.value +=
              " // " + section_number_tag_9999_prefix + section_number_tag;
          }
        }

      } /* end for (i in input_content) */
      input_content = [];

      output_box.value += "\n";
    }  /* end function userjsReduce */

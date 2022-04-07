// Name         : userjs-tool-userjs-append.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // userjsAppend
    // *************************************

    function userjsAppend(input_box_name, input_box_name_2, output_box_name) {

      var input_box = document.getElementById(input_box_name);
      var input_box_2 = document.getElementById(input_box_name_2);
      var output_box = document.getElementById(output_box_name);
      // convert in-block comments to in-line (improves inactive pref recognition)
      var append_content =
        amendCodeComments(input_box_2.value, true)
        .replace(/(\r\n|\r)/g,'\n').split("\n");

      var x = new RegExp("^[ \t]*\/\/\/\/ --- add-override-comment ---[ \t]*$", "mi");
      var override_tagging_on = x.test(input_box_2.value);
      output_box.value = '';
      updateDateTimeStampVariable();
      output_box.value +=
        '// ' + date_time_stamp
        + " appended user-overrides.js to user-template.js\n\n"
        + input_box.value.replace(/[\r\n]*$/, "")
        + "\n\n\n\n\n"
        + "/*** (overrides) __________ "
        + "(start of overrides) __________ ***/\n"
        + 'user_pref("_user.js.parrot", "(overrides) (start of overrides)");'
        + "\n\n\n\n\n";

      var i = 0;
      for (i in append_content) {
        var line = append_content[i];
        var prefName;

        // (after amendCodeComments) change  '// /*...*/'  to  '/*...*/'
        x = new RegExp("^\\/\\/ ([ \t]*\\/\\*.*\\*\\/[ \t]*)$", "gm");
        line = line.replace(x, "$1");

        // overrides: comment-out
        x = new RegExp("^[ \t]*\/\/\/\/ --- comment-out --- '([^']+)'.*$");
        if (x.test(line)) {
          // override-out comment pref in the output
          prefName = line.replace(x, "$1");
          x = new RegExp("user_pref[ \t]*\\([ \t]*[\"']"
            + RegExp.escape(prefName) + "[\"']", "gm");
          output_box.value = output_box.value.replace(x, "\/\/\/\/COMMENT-OUT: $&");
          // prevent duplicated ////COMMENT-OUT:
          x = new RegExp("\/\/\/\/COMMENT-OUT: (\/\/\/\/COMMENT-OUT: "
            + "user_pref[ \t]*\\([ \t]*[\"']"
            + RegExp.escape(prefName) + "[\"'])", "gm");
          output_box.value = output_box.value.replace(x, "$1");
        }

        // if override tagging is required, for active overrides user_pref
        // prefix any already occurring same name user_pref with ////OVERRIDE:
        x = new RegExp("^[ \t]*user_pref", "i");
        if ( (override_tagging_on) && (x.test(line)) ) {
          // get prefname
          x = new RegExp("^(.*user_pref)"  // $1 user_pref  //user_pref  etc
            + "([ \t]*\\([ \t]*[\"'])"     // $2 ("  ('
            + "([^\"']+)"                  // $3 prefname
            + "([\"'][ \t]*,[ \t]*)"       // $4 ",  ',
            + "(.*)"                       // $5 prefvalue  "prefvalue"  'prefvalue'
            + "([ \t]*\\)[ \t]*;)"         // $6 );
            + "(.*)$", "gi");              // $7 afters/comment
          prefName = line.replace(x,"$3");
          // override comment pref in the output
          if (prefName != "_user.js.parrot") {
            x = new RegExp("user_pref[ \t]*\\([ \t]*[\"']"
              + RegExp.escape(prefName) + "[\"']", "gm");
            output_box.value = output_box.value.replace(x, "\/\/\/\/OVERRIDE: $&");
            // prevent duplicated ////OVERRIDE:
            x = new RegExp("\/\/\/\/OVERRIDE: (\/\/\/\/OVERRIDE: "
              + "user_pref[ \t]*\\([ \t]*[\"']"
              + RegExp.escape(prefName) + "[\"'])", "gm");
            output_box.value = output_box.value.replace(x, "$1");
          }
        }

        // append line
        output_box.value += line + "\n";
      }
      append_content = [];

      output_box.value += "\n\n\n\n/*** (overrides) (end of overrides) ***/\n";
      output_box.value +=
        'user_pref("_user.js.parrot", "(overrides) (end of overrides)'
        + ': SUCCESS");' + "\n";
    }  /* end function userjsAppend */

// Name         : userjs-tool-userjs-viewer.js
// Project      : https://github.com/icpantsparti2/firefox-user.js-tool
// On-line      : https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html
// License (MIT): https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/LICENSE
// Version      : 2022.04.06

    // *************************************
    // userjsViewer
    // *************************************

    /* build and display userjs as HTML */

    function userjsViewer(text_box_name, convert_code_comments) {

      // update date of hidden heading (H1/H3/DL tags for bookmarks import compatibility)
      updateDateTimeStampVariable();

      document.getElementById("hiddendate").innerHTML =
        document.getElementById("hiddendate").innerHTML
          .replace(/(--userjs_)[0-9_]+/, "$1" + date_time_stamp);

      // get content and clear input and page
      document.getElementById("view_area").innerHTML = "";
      var content;

      // if View+ style is selected in the menu
      if (typeof convert_code_comments !== "boolean") {
        convert_code_comments = toggleViewPlusOnView("status");
      }

      // convert in-block comments to in-line
      // (improves inactive pref recognition)
      if (convert_code_comments) {
        content =
          amendCodeComments(document.getElementById(text_box_name).value, true)
            .replace(/(\r\n|\r)/g,'\n').split("\n");
      }
      else {
        content = document.getElementById(text_box_name).value
          .replace(/(\r\n|\r)/g,'\n').split("\n");
      }

      var theme = document.body.className.replace( /(^| *)[^_]+_/ , '');

      // variables for holding HTML that we build from the content
      var index_select_html = ''
        + '      <option value="" disabled selected hidden>&#x25BE;Index</option>\n';
      var groups_container_html = '';
      var content_html = '';

      var section_heading = '(TOP) / Introduction';
      // if there is only 1 section we will not collapse the viewer
      var section_count = 1;
      var userjs_type = "";
      var group_user_pref_list = '';
      var previousLineWasBlank = true, currentLineWasBlank;

      // some common HTML used for each section_heading

      function appendSectionStartHtml() {
        index_select_html += '      <option>' + section_heading + '</option>\n';
        groups_container_html += '<a target="_blank" href="about:config?filter=/^\\*$|^(';
        content_html += ""  // plus below
          // hidden heading (H1/H3/DL tags for bookmarks import compatibility)
          + '  <div class="hidden"><H3>' + section_heading + '</H3></div>\n'
          + '  <button type="button" class="controls borders '
          + 'controls_' + theme + ' borders_' + theme
          + ' heading_buttons" id="'
          + section_heading + '">' + section_heading + '</button>\n'
          + '  <div class="content">\n';
      }

      function appendSectionEndHtml() {
        // remove trailing '|'
        group_user_pref_list = group_user_pref_list.replace(/\|$/, '');
        groups_container_html += group_user_pref_list + ')(;|$)|^$/i">-' + section_heading + '</A><br>\n';
        content_html += '</div><br>\n\n\n';  // end section
        group_user_pref_list = '';
      }

      /* work through each line of the user.js content */
      // detect headings, user_pref, values, and URLs
      // insert color class styles and section blocks
      // by appending code to:  index_select_html  groups_container_html  content_html

      appendSectionStartHtml();
      var i = 0;
      for (i in content) {
        var line = content[i];

        if (/^[ \t]*$/.test(line)) {
          currentLineWasBlank = true;
        }
        else {
          currentLineWasBlank = false;
        }

        userjs_type = detectUserjsType(line,userjs_type,i);

        // on section_heading detection: end previous section, start new section
        if ( detectSectionHeading(line,userjs_type,i) == true ) {
          if (!previousLineWasBlank) { content_html += "\n" }
          previousLineWasBlank = true;
          appendSectionEndHtml();
          section_heading = tidySectionHeading(line);
          appendSectionStartHtml();
          section_count += 1;
        }

        // HTML code injection prevention
        // replace & < > characters with HTML escape codes
        line = escapeHtml(line);

        // on user_pref lines add span and class tags
        // (for syntax highlighting pretty colors)
        var x,r;
        var line_userpref_part = "";

        x = new RegExp("^(.*user_pref)"  // $1 user_pref  //user_pref  etc
          + "([ \t]*\\([ \t]*[\"'])"     // $2 ("  ('
          + "([^\"']+)"                  // $3 prefname
          + "([\"'][ \t]*,[ \t]*)"       // $4 ",  ',
          + "(.*)"                       // $5 prefvalue  "prefvalue"  'prefvalue'
          + "([ \t]*\\)[ \t]*;)"         // $6 );
          + "(.*)$", "gi");              // $7 afters/comment

        if (x.test(line)) {

          // separate line into:  line_userpref_part) user_pref statement  line) afters/comment
          line_userpref_part = line.replace(x,"$1$2$3$4$5$6");
          line = line.replace(x,"$7");


          // add some HTML (tag and class for colors)

          // a/href for:  prefname  (turn into an about:config link)
          x = new RegExp("^(.*user_pref[ \t]*\\([ \t]*[\"'])"
            + "([^\"']+)([\"'].*)$", "i");
          r = "$2";
          var pref_escaped = line_userpref_part.replace(x, r).replace(/([*.+])/g, "\\$1");
          r = "$1<a target=\"_blank\" href=\"about:config?filter=/^\\*\$|^("
            + pref_escaped + ")(;|\$)|^\$/i\">$2</A>$3";
          line_userpref_part = line_userpref_part.replace(x, r);
          // add prefname to groups
          group_user_pref_list += pref_escaped + "|";

          // span/class for:  //user_pref  /*user_pref  user_pref
          if (new RegExp("([/][/*]+[ \t]*user_pref)", "i").test(line_userpref_part)) {
            // for:  "// user_pref"  "/* user_pref"
            x = new RegExp("([/][/*]+[ \t]*user_pref)", "i");
            r = '<span class="pref">$1</span>';
            line_userpref_part = line_userpref_part.replace(x, r);
          }
          else {
            // for:  "user_pref"  (without // or /* immediately before)
            //x = new RegExp("([ /*\t]*user_pref)", "i");
            x = new RegExp("(user_pref)", "i");
            r = '<span class="pref">$1</span>';
            line_userpref_part = line_userpref_part.replace(x, r);
          }

          // span/class for:  false  (prefvalue)
          if (new RegExp(",[ \t]*false[ \t]*\\);", "i").test(line_userpref_part)) {
            x = new RegExp("(,[ \t]*)(false)([ \t]*\\);)", "i");
            r = '$1<span class="false">$2</span>$3';
            line_userpref_part = line_userpref_part.replace(x, r);
          }
          // span/class for:  true  (prefvalue)
          else if (new RegExp(",[ \t]*true[ \t]*\\);", "i").test(line_userpref_part)) {
            x = new RegExp("(,[ \t]*)(true)([ \t]*\\);)", "i");
            r = '$1<span class="true">$2</span>$3';
            line_userpref_part = line_userpref_part.replace(x, r);
          }
          // span/class for:  integer  (prefvalue)
          else if (new RegExp(",[ \t]*[0-9.+-]+[ \t]*\\);", "i").test(line_userpref_part)) {
            x = new RegExp("(,[ \t]*)([0-9.+-]+)([ \t]*\\);)", "i");
            r = '$1<span class="integer">$2</span>$3';
            line_userpref_part = line_userpref_part.replace(x, r);
          }
          // span/class for:  "string"  'string'  (prefvalue)
          else {
            x = new RegExp("(,[ \t]*)([\"']*.*[\"']*)([ \t]*\\);)", "i");
            r = '$1<span class="string">$2</span>$3';
            line_userpref_part = line_userpref_part.replace(x, r);
          }

          // span/class for:  ////OVERRIDE:  ////COMMENT-OUT:
          x = new RegExp("\/\/\/\/(OVERRIDE|COMMENT-OUT):", "gi");
          r = '<span class="overrides">$&</span>';
          line_userpref_part = line_userpref_part.replace(x, r);

        }

        // a/href for:  HTTP/HTTPS URLs  (turn into a link)
        x = new RegExp("(https?:[/][/][^ \"']+[^\\)\\], \"'.;])", "gi");
        r = '<a target="_blank" rel="external noopener noreferrer" href="$1" class="http">'
          + '<span class="hidden">__</span>$1</A>';
        line = line.replace(x, r);

        // span/class for:  [WARNING]
        x = new RegExp("(\\[WARNING\\]|\\[WARNING.)", "gi");
        r = '<span class="warn">$1</span>';
        line = line.replace(x, r);

        // span/class for:  (hidden pref)  [HIDDEN PREF]
        x = new RegExp("([\\[\\(]hidden pref[^\\)\\]]*[\\)\\]])", "gi");
        r = '<span class="hid">$1</span>';
        line = line.replace(x, r);

        // span/class for:  [SETUP]  [SETUP-...]
        x = new RegExp("(\\[SETUP\\]|\\[SETUP-[^\\]]+\\]|\/\/[ \t]NOTICE-DISABLED:)", "gi");
        r = '<span class="setup">$1</span>';
        line = line.replace(x, r);

        // span/class for:  arkenfox ref
        if (line_userpref_part == "" && userjs_type == "arkenfox") {

          // for:  /* 1234:  /*** 1234:
          // ref in bold and color whole line
          x = new RegExp("^((?:\/\/ )?[/*]+ )([0-9][0-9][0-9][0-9][^:]*)(:)(.*?)([ /*]*)?$", "gi");
          r = "";
          if (convert_code_comments) {
            // add extra newline (if the replace matches)
            if (!previousLineWasBlank) { r = "\n" }
            if (x.test(line)) { previousLineWasBlank = true; }
          }
          r += '$1<span class="ref">$2</span><span class="ref" style="font-weight: normal">$3$4</span>$5';
          line = line.replace(x, r);

          // for:  /*** [SECTION 1234]:
          // ref in bold and color whole line
          x = new RegExp("^((?:\/\/ )?[/*]+ )(\\[SECTION [0-9][0-9][0-9][0-9][^\\]]*\\])(:)(.*?)([ /*]*)?$", "gi");
          r = '$1<span class="ref">$2</span><span class="ref" style="font-weight: normal">$3$4</span>$5';
          line = line.replace(x, r);

          // for:  /* /** /***
          if ( (convert_code_comments) && (!previousLineWasBlank) ) {
            x = new RegExp("^((?:\/\/ )?\\/\\*.*)$", "gi");
            r = "\n$1";
            line = line.replace(x, r);
            x = new RegExp("^((?:\/\/ )?\\/\\/ FF[0-9.+]+)$", "gi");
            r = "\n$1";
            line = line.replace(x, r);
          }

        }
        else if (line_userpref_part == "" && userjs_type == "pyllyukko") {
          // for:  * SECTION:  and  // PREF:
          x = new RegExp("^((?:\/\/ )?[ *\t]*)((?:SECTION|PREF):.*)([ *\t]*)$", "gi");
          // color
          r = '$1<span class="ref" style="font-weight: normal">$2</span>$3';
          line = line.replace(x, r);
        }

        // add to HTML code
        content_html += line_userpref_part + line + '\n';

        previousLineWasBlank = currentLineWasBlank;

      } /* end for (i in content) */
      content = [];

      appendSectionEndHtml();


      /* update HTML page with the new content */
      content_html += '  <span class="anchor" id="(BOTTOM)"></span><br><br><br></DL>\n';
      index_select_html += '<option>(BOTTOM)</option>\n';
      document.getElementById("index_select").innerHTML = index_select_html;

      // also remove first group if unused
      document.getElementById("groups_container").innerHTML =
        groups_container_html.replace(new RegExp('<a target="_blank"'
          + ' href="about:config\\?filter='
          + '\\/\\^\\\\\\*\\$\\|\\^\\(\\)\\(;\\|\\$\\)\\|\\^\\$\\/i">'
          + '-\\(TOP\\) \\/ Introduction<\\/A><br>'), "");

      document.getElementById("view_area").innerHTML = content_html;
      index_select_html = null;
      groups_container_html = null;
      content_html = null;


      /* actions following the new content addition */

      /* add listener for expand/collapse individual sections (multiple buttons) */
      var e = document.getElementsByClassName("heading_buttons");
      for (var i = 0, j = e.length; i<j; i++) {
        e[i].addEventListener("click", function() {
          var next = this.nextElementSibling;
          if (next.style.display === "block") {
            next.style.display = "none";
          } else {
            next.style.display = "block";
          }
          section_focus = this;
        });
      }

      invertColorForClass("overrides");
      togglePrefixAboutConfigLinks("refresh");
      setWrap("refresh");
      if (toggleExpandAllOnView("status") || section_count == 1) {
        setExpandAll(true);
      }
      if (toggleGroupsOnView("status")) { toggleGroupsPanel(true); }

    }  /* end function userjsViewer */

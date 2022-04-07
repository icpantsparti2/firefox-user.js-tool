#### userjs-tool.html

> This is a continuation of the project by the same maintainer (previously under @icpantsparti)

Interactive view, compare, and more for Firefox user.js (eg arkenfox/user.js) + about:config functions

[Open userjs-tool.html on-line (github.io)](https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html)

[View the current <i>arkenfox user.js</i>* in a table (github.io)](https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html?at)

[Functions to get more out of about:config (eg: find, filter, list, save to file, etc)](https://raw.githubusercontent.com/icpantsparti2/firefox-user.js-tool/master/userjs-tool-aboutconfig-functions.js)

> > > \*Note: the excellent `arkenfox user.js` is by other developers at:<br>
> > > [arkenfox user.js home](https://github.com/arkenfox/user.js) / [arkenfox user.js issues](https://github.com/arkenfox/user.js/issues?q=sort%3Aupdated-desc) / [arkenfox user.js wiki](https://github.com/arkenfox/user.js/wiki)

----

<details><summary><b>Introduction</b></summary><br>

Display a Mozilla Firefox user.js settings file contents in your Firefox browser, with:
* highlighting, links, themes*, re-size, wrap, about:config links/regex/groups
* expanding sections, and index to go to sections (with compatible user.js projects)
* compare preferences in two user.js, in a table format with order/layout options and bold cell border around differences
* actions including: user-overrides.js* append* (with comment-out*), point and click overrides collector, skeleton, prefs.js cleaner*, group by values
* load/save, drag/drop, or copy/paste user.js files (can load from some on-line URLs too)
* functions for find (filter/list)/reset/set on about:config Web Console (Firefox/forks/Thunderbird/SeaMonkey)
* This is coded in HTML/CSS/JavaScript with no cross domain dependency
* open [userjs-tool.html on-line](https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html) or save for off-line use

(*arkenfox/user.js inspired.  Please visit [arkenfox/user.js](https://github.com/arkenfox/user.js) and read their info on [arkenfox/user.js/wiki](https://github.com/arkenfox/user.js/wiki). They also have nice scripts for append/clean/troubleshoot.)

This started as an over the top experiment for learning some HTML/CSS/JavaScript (first released 2019.01.02, compare added 2020.02.22).  This is a viewer/tool, and not an editor/installer.

Disclaimer: Use with care at your own risk, and verify any results

----

</details>

<details><summary><b>(Optional) How to save and open <code>userjs-tool.html</code> off-line</b></summary><br>

* Click the Code button on this repo and Download ZIP (https://github.com/icpantsparti2/firefox-user.js-tool/archive/refs/heads/master.zip)
* Open the saved `userjs-tool.html` file with your Firefox browser  
(you can drag and drop it from your Downloads folder into a new tab)
* Bookmark it for easy access
* Remember to check here for updates

----

</details>

<details><summary><b>Other Info</b></summary>

* The `userjs-tool-aboutconfig-functions.js` file is also embeded in `userjs-tool.html` (view with the [a:c Functions] button).

* You can do these (and more) from the interface, or by using URL parameters:
  
    * [View the current arkenfox user.js (github.io)](https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html?av)

    * [View the current arkenfox user.js in a table (github.io)](https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html?at)
  
    * Load and view a user.js URL: [https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html?action=view1&load1=%68ttps://raw.githubusercontent.com/arkenfox/user.js/master/user.js](https://icpantsparti2.github.io/firefox-user.js-tool/userjs-tool.html?action=view1&load1=%68ttps://raw.githubusercontent.com/arkenfox/user.js/master/user.js)

----

</details>

<b>Preview</b>

<img src="/images/userjs-tool.png" width="400" />

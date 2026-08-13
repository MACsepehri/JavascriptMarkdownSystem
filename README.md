# JavascriptMarkdownSystem
JavascriptMarkdownSystem

# Description
Many website use markdown system for showing codes clearly and beautiful.
I always had question to how to create one. Today I wanna create my own
markdown and publish for people to use it easly just with sample
javascript codes.

# Usage
<h2>The most easy way to use markdown :</h2>
<pre>

    <div class="my-code">
        ```
            <!-- something here ... -->
        ```
    </div>

    <!-- Link the markdown.js into your code -->
    <script>
        markdown(className="my-code", idName=""); // you need to give className or idName for selection.
    </script>
</pre>
Or you can replace ``` for starting with ```Your-Coding-Lang to make it colorfull.
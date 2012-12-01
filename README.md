One way to implement search in Middleman blogs.

For more details, check out [my tutorial](http://designbyjoel.com/blog/2012-11-23-middleman-search/).

Now that you&rsquo;ve [built a blog in Middleman](/blog/2012-10-20-building-a-blog-in-middleman/), you&rsquo;re probably wondering how to build out one of the best features with a ready-made CMS package like Wordpress: search.

The good news is that search is completely possible in a flat-file, database-less CMS, and it&rsquo;s really not all that complicated.

The bad news is that it takes a bit of doing. The basic concept is creating a search form that, instead of POST-ing to a backend PHP/Python/Rails application for database querying, we'll be GET-ing a JSON file with the necessary information on our Middleman site&rsquo;s posts. JSON is a good choice because JavaScript/jQuery gives us a number of ways to parse the file.

Here&rsquo;s the game plan. **First**, we need to make that JSON file. **Second**, we need to add the search form and the necessary JavaScript to make it get a JSON file instead of its default POST-ing behavior. **Third**, we need to parse the JSON and push the results onto the page.

## Step 1: Build JSON ##

Create a file in your `source` directory named `entries.json.erb`. In that file, paste the following:

    <%
    blog.articles.each do |article|
      entry = {
        :title => article.title, 
        :url => article.url,
        :content => article.body
      }
      entries << entry
    end
    %><%=entries.to_json %>

This is your typical blog loop, and will build out a JSON file with the title, url and content for each post in your blog. This will be the data that&rsquo;s searched when a visitor punches something into your search form.

## Step 2: Search-ify Your Site ##

Where/how you add a search form to your site is completely up to you. I&rsquo;ll just give an example of what my search form looks like:

    <form>
      <input class="search-term" type="search" placeholder="example: lorem ipsem" required="required" />
      <input class="search-submit" type="submit" value="Go" />
    </form>

Simple. As it stands, this form won&rsquo;t do anything of use to you. That&rsquo;s where JavaScript/jQuery will come in. 

## Step 3: Parse and Display ##

Now, keep in mind here that I use CoffeeScript when writing JavaScript, so if you don&rsquo;t, this is going to look pretty foreign. But, considering that Middleman supports Coffescript out-of-the-box, and that Coffeescript is prety amazing, you might just want to give this a shot. Here is the full chunk. This would go into whatever JS file you use on the site, within the primary jQuery `$(document).ready(function() {});` function.

    $('.search-submit').on 'click', (e) ->
      e.preventDefault()
      search_term = $('.search-term').val().toLowerCase()
      $.getJSON '/entries.json', (data) ->
        results = []
        for i in data
          value = 0
          if i.title.toLowerCase().split(search_term).length - 1 isnt 0
            value = 10
          if i.content.toLowerCase().split(search_term).length - 1 isnt 0
            value += (i.content.toLowerCase().split(search_term).length - 1) * 5
          if value isnt 0
            i.value = value
            results.push i
        $('.search-results').html ''
        if results isnt []
          for result in results
            $('.search-results').append '<p><a class="copy-bg" href="/'+result.url+'">'+result.title+'</a></p>'
        else
          $('.search-results').append '<p>No results found. Sorry.</p>'

Let&rsquo;s break this down a little bit. Right off the bat, we create a click handler on the submit button in our form, and prevent that form from trying to POST anywhere. Then we convert the search term to all lowercase, to make matching easier. Next, we get the JSON file.

Once that JSON file has been received, we create an empty array for the results and then loop through the JSON file. Now, we need to check if the search term exists in either the title or the content of each post. That&rsquo;s what the `if i.title.toLowerCase().split(search_term).length - 1 isnt 0` if statement is testing. 

If the search term exists in the title, I add 10 to the &ldquo;value&rdquo;. If it exists in the body, I add 5 for each iteration. It&rsquo;s an incredibly basic pseudo-algorithm, but based on my testing, it works pretty well for basic uses.

If the &ldquo;value&rdquo; isn&rsquo;t 0, then we add that entry to our results array. Once we have that filled array, we&rsquo;ll loop through through that and create an new paragraph for each, append it to the DOM in whatever element has been established for results.

If there are no good results, we spit out a little notice telling the user that nothing was found.

## Step &infin;: Making it Your Own ##

To make this work best for you, most of the changes you&rsquo;ll need to make involve the elements to be appended into the search results. I give a relatively simple example of a paragraph tag with the result&rsquo;s title as a link to said result.

On [Here is History](http://hereishistory.com), where I first worked on this technique, I append the results via an unordered list, with the title and a small teaser included.

As with all Middleman-based projects, a little hacking is required, but with any luck, I&rsquo;ll carve out some time in the near future to make this a little bit easier for less tech-savvy users to implement.

For an example of the full implementation, check out the [Github repository](https://github.com/joelhans/middleman-search-example) that I put together. Should give most users everything they need to get search going in Middleman.

### Some caveats ###

Isn&rsquo;t pretty. Probably doesn&rsquo;t scale well. Requires JavaScript. Probably doesn&rsquo;t work on IE > 9. Oh, well.

#### JavaScript version ####

As a bit of an afterthought, I&rsquo;ve gone ahead and compiled a JavaScript version of my above Coffeescript version, so maybe you JS users can find some use in it. It&rsquo;s going to be a bit weird, considering that it&rsquo;s a compilation, but it will work.

    $('.search-submit').on('click', function(e) {
      var search_term;
      e.preventDefault();
      search_term = $('.search-term').val().toLowerCase();
      return $.getJSON('/entries.json', function(data) {
        var i, result, results, value, _i, _j, _len, _len1, _results;
        results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          i = data[_i];
          value = 0;
          if (i.title.toLowerCase().split(search_term).length - 1 !== 0) {
            value = 10;
          }
          if (i.content.toLowerCase().split(search_term).length - 1 !== 0) {
            value += (i.content.toLowerCase().split(search_term).length - 1) * 5;
          }
          if (value !== 0) {
            i.value = value;
            results.push(i);
          }
        }
        $('.search-results').html('');
        if (results !== []) {
          _results = [];
          for (_j = 0, _len1 = results.length; _j < _len1; _j++) {
            result = results[_j];
            _results.push($('.search-results').append('<p><a class="copy-bg" href="/' + result.url + '">' + result.title + '</a></p>'));
          }
          return _results;
        } else {
          return $('.search-results').append('<p>No results found. Sorry.</p>');
        }
      });
    });
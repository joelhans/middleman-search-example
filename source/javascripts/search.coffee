$ = jQuery

$ ->

  $('.search-submit').on 'click', (e) ->
    e.preventDefault()
    search_term = $('.search-term').val().toLowerCase()
    # Change the following to '/entries.json' to use the real version using your
    # own content.
    $.getJSON '/entries-example.json', (data) ->
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
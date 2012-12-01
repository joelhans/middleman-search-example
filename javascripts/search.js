(function() {
  var $;

  $ = jQuery;

  $(function() {
    return $('.search-submit').on('click', function(e) {
      var search_term;
      e.preventDefault();
      search_term = $('.search-term').val().toLowerCase();
      return $.getJSON('../entries-example.json', function(data) {
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
  });

}).call(this);

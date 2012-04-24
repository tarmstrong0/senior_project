/**
 * Handle Asynchronous searching
 */
$('#searchForm').on('submit', function(e) {
	$('#results').html('Searching...');

	$.ajax({
		url: $(this).attr('action'),
		data: {
			query: $('#query').val()
		},
		success: function(data) {
			$('#results').html(data);
		},
		dataType: 'html'
	});

	return false;
});

/**
 * Focus search on pageload
 */
$(function() {
	$('#query').focus();
});

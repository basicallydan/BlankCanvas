if (typeof console === 'undefined') {
	console = {
		log: function() {
			// Protecting ourselves here because console is useful
		}
	}
}
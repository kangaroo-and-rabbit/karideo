
/**
 * @brief create the rest call element of the link
 */
let createRESTCall = function(api, options) {
	// http://localhost/exercice
	let basePage = "" + window.location;
	if (basePage.endsWith("index.xhtml") == true) {
		basePage = basePage.substring(0, basePage.length - 11);
	}
	if (basePage.endsWith("index.php") == true) {
		basePage = basePage.substring(0, basePage.length - 10);
	}
	let addressServerRest =basePage + "/api/v1/index.php";
	if (typeof options === 'undefined') {
		options = [];
	}
	let out = addressServerRest + "?REST=" + api;
	for (let iii=0; iii<options.length; iii++) {
		out += "&" + options[iii];
	}
	return out;
}


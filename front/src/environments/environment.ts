// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	// URL of development API
	//apiUrl: 'http://localhost:9000/nc1'
	//apiUrl: 'http://localhost:9000/backPHP',
	apiUrl: 'http://localhost:15080',
	//apiUrl: 'http://localhost:4201'
	//apiMode: "QUERRY"
	apiMode: "REWRITE"
}

/**
 * @brief create the rest call element of the link
 */
/*
export let createRESTCall = function(api, options) {
	let basePage = environment.apiUrl;
	let addressServerRest = basePage + "/api/v1/";
	let out;
	if (environment.apiMode == "QUERRY") {
		out = addressServerRest + "?REST=" + api
		if (typeof options === 'undefined') {
			options = [];
		}
		for (let iii=0; iii<options.length; iii++) {
			out += "&" + options[iii];
		}
	} else {
		if (typeof options === 'undefined') {
			options = [];
		}
		out = addressServerRest + api;
		let first = true;
		for (let iii=0; iii<options.length; iii++) {
			if (first ==false) {
				out += "&";
			} else {
				out += "?";
				first = false;
			}
			out += options[iii];
		}
	}
	return out;
}
*/

export let createRESTCall = function(api, options) {
	let basePage = environment.apiUrl;
	let addressServerRest = basePage + "/";
	let out;
	if (typeof options === 'undefined') {
		options = [];
	}
	out = addressServerRest + api;
	let first = true;
	for (let iii=0; iii<options.length; iii++) {
		if (first ==false) {
			out += "&";
		} else {
			out += "?";
			first = false;
		}
		out += options[iii];
	}
	return out;
}


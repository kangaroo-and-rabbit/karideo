// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	// URL of development API
	//apiUrl: 'http://localhost:15080',
	apiUrl: 'http://localhost:18080/karideo/api',
	apiOAuthUrl: 'http://localhost:17080/oauth/api',
	frontBaseUrl: '',
	//apiMode: "QUERRY"
	apiMode: "REWRITE"
}

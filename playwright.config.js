/**
 * External dependencies
 */
const { devices } = require( '@playwright/test' );

/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/playwright.config.js' );

module.exports = {
	...config,
	testDir: './test/e2e',
	webServer: {
		...config.webServer,
		command: 'npm run wp-env-test -- start',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ] },
		},
		{
			name: 'firefox',
			use: {
				...devices[ 'Desktop Firefox' ],
				launchOptions: {
					// Allow the AudioContext to start in headless Firefox. Without this,
					// starting audio never completes in CI and no notes are played.
					firefoxUserPrefs: {
						'media.autoplay.default': 0,
						'media.autoplay.block-webaudio': false,
					},
				},
			},
		},
		{
			name: 'webkit',
			use: { ...devices[ 'Desktop Safari' ] },
		},
	],
};

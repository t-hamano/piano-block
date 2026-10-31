/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Front end', () => {
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'should render the block when "Display on the front end" is enabled', async ( {
		page,
		requestUtils,
	} ) => {
		const post = await requestUtils.createPost( {
			status: 'publish',
			content: '<!-- wp:piano-block/piano {"showOnFront":true} /-->',
			date_gmt: new Date().toISOString(),
		} );
		await page.goto( post.link );
		await expect( page.locator( '.wp-block-piano-block-piano' ) ).toHaveCount( 1 );
		await expect( page.getByRole( 'slider', { name: 'Volume' } ) ).toBeVisible();
		await expect( page.getByRole( 'application', { name: 'Piano' } ) ).toHaveAccessibleDescription(
			'Press keys on your keyboard to play notes. Press Tab to move to the controls.'
		);
	} );

	test( 'should output nothing when "Display on the front end" is disabled', async ( {
		page,
		requestUtils,
	} ) => {
		const post = await requestUtils.createPost( {
			status: 'publish',
			content: '<!-- wp:piano-block/piano /-->',
			date_gmt: new Date().toISOString(),
		} );
		await page.goto( post.link );
		await expect( page.locator( '.wp-block-piano-block-piano' ) ).toHaveCount( 0 );
	} );

	test( 'should clamp out-of-range values in data-settings', async ( { page, requestUtils } ) => {
		const post = await requestUtils.createPost( {
			status: 'publish',
			content:
				'<!-- wp:piano-block/piano {"showOnFront":true,"volume":100,"octaveOffset":-10} /-->',
			date_gmt: new Date().toISOString(),
		} );
		await page.goto( post.link );
		const settings = JSON.parse(
			( await page.locator( '.wp-block-piano-block-piano' ).getAttribute( 'data-settings' ) ) ??
				'{}'
		);
		expect( settings.volume ).toBe( 5 );
		expect( settings.octaveOffset ).toBe( -2 );
	} );
} );

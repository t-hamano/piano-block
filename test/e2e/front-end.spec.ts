/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright';

function createPublishedPost( requestUtils: RequestUtils, content: string ) {
	return requestUtils.createPost( {
		status: 'publish',
		content,
		date_gmt: new Date().toISOString(),
	} );
}

test.describe( 'Front end', () => {
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'should render the block when "Display on the front end" is enabled', async ( {
		page,
		requestUtils,
	} ) => {
		const post = await createPublishedPost(
			requestUtils,
			'<!-- wp:piano-block/piano {"showOnFront":true} /-->'
		);
		await page.goto( post.link );
		await expect( page.locator( '.wp-block-piano-block-piano' ) ).toHaveCount( 1 );
		await expect( page.getByRole( 'slider', { name: 'Volume' } ) ).toBeVisible();
	} );

	test( 'should output nothing when "Display on the front end" is disabled', async ( {
		page,
		requestUtils,
	} ) => {
		const post = await createPublishedPost( requestUtils, '<!-- wp:piano-block/piano /-->' );
		await page.goto( post.link );
		await expect( page.locator( '.wp-block-piano-block-piano' ) ).toHaveCount( 0 );
	} );

	test( 'should clamp out-of-range values in data attributes', async ( { page, requestUtils } ) => {
		const post = await createPublishedPost(
			requestUtils,
			'<!-- wp:piano-block/piano {"showOnFront":true,"volume":100,"octaveOffset":-10} /-->'
		);
		await page.goto( post.link );
		const block = page.locator( '.wp-block-piano-block-piano' );
		await expect( block ).toHaveAttribute( 'data-volume', '5' );
		await expect( block ).toHaveAttribute( 'data-octave-offset', '-2' );
	} );

	test( 'should add the is-pressed class while a key is pressed', async ( {
		page,
		requestUtils,
	} ) => {
		// The synthesizer needs no samples to load, so it is ready right away.
		const post = await createPublishedPost(
			requestUtils,
			'<!-- wp:piano-block/piano {"showOnFront":true,"instrument":"synthesizer"} /-->'
		);
		await page.goto( post.link );
		const piano = page.getByLabel( 'Piano: Press keys to play' );
		const key = page.getByRole( 'button', { name: 'Note: C3' } );
		await piano.focus();
		// The first key press only starts the audio context.
		await page.keyboard.press( 'z' );

		await expect( async () => {
			await page.keyboard.down( 'z' );
			await expect( key ).toHaveClass( /is-pressed/, { timeout: 1000 } );
		} ).toPass();
		await page.keyboard.up( 'z' );
		await expect( key ).not.toHaveClass( /is-pressed/ );
	} );
} );

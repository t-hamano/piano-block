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
} );

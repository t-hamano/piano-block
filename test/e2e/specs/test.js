/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';

const page = global.page;

page.on( 'dialog', async ( dialog ) => await dialog.accept() );

describe( 'Block', () => {
	beforeAll( async () => {
		await setBrowserViewport( 'large' );
	} );

	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should update attributes', async () => {
		await insertBlock( 'Piano' );

		// Volume
		await page.waitForXPath( '//label[text()="Volume"]' );
		const [ volume ] = await page.$x( '//label[text()="Volume"]' );
		await volume.click();
		for ( let i = 0; i < 3; i++ ) {
			await page.keyboard.press( 'ArrowLeft' );
		}

		// Octave Offset
		const [ octaveOffset ] = await page.$x( '//button[text()="-2"]' );
		await octaveOffset.click();

		// Instrument
		const [ instrument ] = await page.$x( '//label[text()="Insturment"]' );
		await instrument.click();
		await page.keyboard.press( 'Enter' );
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'Enter' );

		// Use Sustain Pedal
		const [ useSustainPedal ] = await page.$x( '//label[text()="Use Sustain Pedal"]' );
		await useSustainPedal.click();

		// Display on the front end
		const [ sidebarButton ] = await page.$$(
			'.edit-post-header [aria-label="Settings"][aria-expanded="false"]'
		);
		await sidebarButton.click();
		await page.waitForXPath( '//label[text()="Display on the front end"]' );
		const [ showOnFront ] = await page.$x( '//label[text()="Display on the front end"]' );
		await showOnFront.click();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );

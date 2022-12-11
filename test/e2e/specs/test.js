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

	it( 'should update attributes related to sound using only keyboard.', async () => {
		await insertBlock( 'Piano' );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'ArrowRight' );

		// Volume
		for ( let i = 0; i < 3; i++ ) {
			await page.keyboard.press( 'ArrowLeft' );
		}

		// Octave Offset
		await page.keyboard.press( 'Tab' );
		await page.keyboard.press( 'Tab' );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Enter' );

		// Pressing a piano key should not remove focus.
		await page.keyboard.press( 'z' );

		// Instrument
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Enter' );
		for ( let index = 0; index < 14; index++ ) {
			await page.keyboard.press( 'ArrowDown' );
		}
		await page.keyboard.press( 'Enter' );

		// Pressing a piano key should not remove focus.
		await page.keyboard.press( 'z' );

		// Synthesizer Setting
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'ArrowDown' );

		for ( let index = 0; index < 4; index++ ) {
			await page.keyboard.press( 'Tab' );
			await page.keyboard.press( 'ArrowRight' );
			await page.keyboard.press( 'ArrowRight' );
		}
		await page.keyboard.press( 'Escape' );
		// const [ synthesizerSetting ] = await page.$x( '//button[text()="Synthesizer Setting"]' );
		// await synthesizerSetting.click();
		// // Use Sustain Pedal
		// const [ useSustainPedal ] = await page.$x( '//label[text()="Use Sustain Pedal"]' );
		// await useSustainPedal.click();

		// // Display on the front end
		// const [ sidebarButton ] = await page.$$(
		// 	'.edit-post-header [aria-label="Settings"][aria-expanded="false"]'
		// );
		// await sidebarButton.click();
		// await page.waitForXPath( '//label[text()="Display on the front end"]' );
		// const [ showOnFront ] = await page.$x( '//label[text()="Display on the front end"]' );
		// await showOnFront.click();

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should update attributes in the block sidebar.', async () => {
		await insertBlock( 'Piano' );
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

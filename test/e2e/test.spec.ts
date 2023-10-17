/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should update attributes related to sound using only keyboard.', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
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
		// Pressing a piano key should not remove focus.
		await page.keyboard.press( 'z' );
		// Key Layout
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'Enter' );
		// Key Indicator
		await page.keyboard.press( 'ArrowRight' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'Enter' );

		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should update attributes in the block sidebar.', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByLabel( 'Display on the front end' ).click();
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
		expect( true ).toBe( true );
	} );
} );

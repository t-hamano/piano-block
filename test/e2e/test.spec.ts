/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should update attributes related to sound using only keyboard', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		// Volume
		await pageUtils.pressKeys( 'ArrowRight', { times: 2 } );
		await expect( page.getByRole( 'slider', { name: 'Volume' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'ArrowLeft', { times: 3 } );
		// Octave Offset
		await pageUtils.pressKeys( 'Tab', { times: 2 } );
		await expect( page.getByRole( 'button', { name: '-2' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'ArrowRight' );
		await pageUtils.pressKeys( 'Enter' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );
		// Instrument
		await pageUtils.pressKeys( 'ArrowRight', { times: 4 } );
		await expect( page.getByRole( 'combobox', { name: 'Insturment' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown', { times: 14 } );
		await pageUtils.pressKeys( 'Enter' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );
		// Synthesizer Setting
		await pageUtils.pressKeys( 'ArrowRight' );
		await expect( page.getByRole( 'button', { name: 'Synthesizer Setting' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await expect( page.getByRole( 'combobox', { name: 'Oscillator Type' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'ArrowDown', { times: 2 } );
		for ( let index = 0; index < 4; index++ ) {
			await pageUtils.pressKeys( 'Tab' );
			await pageUtils.pressKeys( 'ArrowRight', { times: 2 } );
		}
		await pageUtils.pressKeys( 'Escape' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );
		// Key Layout
		await pageUtils.pressKeys( 'ArrowRight' );
		await expect( page.getByRole( 'combobox', { name: 'Key Layout' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown' );
		await pageUtils.pressKeys( 'Enter' );
		// Key Indicator
		await pageUtils.pressKeys( 'ArrowRight' );
		await expect( page.getByRole( 'combobox', { name: 'Key Indicator' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown' );
		await pageUtils.pressKeys( 'Enter' );

		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test.skip( 'should update attributes in the block sidebar', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByLabel( 'Display on the front end' ).click();
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
		expect( true ).toBe( true );
	} );
} );

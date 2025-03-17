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
		await expect( editor.canvas.getByRole( 'slider', { name: 'Volume' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'ArrowLeft', { times: 3 } );

		// Octave Offset
		await pageUtils.pressKeys( 'Tab', { times: 2 } );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Octave' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown' );
		await pageUtils.pressKeys( 'Enter' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );

		// Instrument
		await pageUtils.pressKeys( 'Tab' );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Instrument' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown', { times: 14 } );
		await pageUtils.pressKeys( 'Enter' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );

		// Synthesizer Setting
		await pageUtils.pressKeys( 'Tab' );
		await expect(
			editor.canvas.getByRole( 'button', { name: 'Synthesizer Setting' } )
		).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await expect( page.getByRole( 'combobox', { name: 'Oscillator Type' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'ArrowDown', { times: 2 } );
		for ( let index = 0; index < 4; index++ ) {
			await pageUtils.pressKeys( 'Tab' );
			await pageUtils.pressKeys( 'ArrowRight', { times: 2 } );
		}
		await pageUtils.pressKeys( 'Escape' );
		// Pressing the escape key in a popover rendered in the iframe editor does not
		// return focus to the anchor element, so explicitly focus the anchor element.
		// see: https://github.com/WordPress/gutenberg/issues/55413
		await editor.canvas.getByRole( 'button', { name: 'Synthesizer Setting' } ).focus();
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );

		// Key Layout
		await pageUtils.pressKeys( 'Tab' );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Key Layout' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown' );
		await pageUtils.pressKeys( 'Enter' );

		// Key Indicator
		await pageUtils.pressKeys( 'Tab' );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Key Indicator' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await pageUtils.pressKeys( 'ArrowDown' );
		await pageUtils.pressKeys( 'Enter' );

		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should update attributes in the block sidebar', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByLabel( 'Display on the front end' ).click();
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
		expect( true ).toBe( true );
	} );
} );

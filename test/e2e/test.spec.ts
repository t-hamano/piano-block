/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import type { Editor } from '@wordpress/e2e-test-utils-playwright';

const BLOCK_NAME = 'piano-block/piano';

async function getBlockAttributes( editor: Editor ) {
	const [ block ] = await editor.getBlocks();
	return block?.attributes;
}

test.describe( 'Block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test.describe( 'Controls', () => {
		test( 'should update volume with the keyboard', async ( { editor, pageUtils } ) => {
			await editor.insertBlock( { name: BLOCK_NAME } );
			const slider = editor.canvas.getByRole( 'slider', { name: 'Volume' } );
			await slider.focus();
			await pageUtils.pressKeys( 'ArrowLeft', { times: 3 } );

			await expect.poll( () => getBlockAttributes( editor ) ).toMatchObject( { volume: -0.3 } );
		} );

		test( 'should update octave with the keyboard', async ( { editor, pageUtils } ) => {
			await editor.insertBlock( { name: BLOCK_NAME } );
			const select = editor.canvas.getByRole( 'combobox', { name: 'Octave' } );
			await select.focus();
			await pageUtils.pressKeys( 'Enter' );
			await pageUtils.pressKeys( 'ArrowDown' );
			await pageUtils.pressKeys( 'Enter' );

			// Pressing a piano key should not remove focus.
			await pageUtils.pressKeys( 'z' );
			await expect( select ).toBeFocused();

			await expect.poll( () => getBlockAttributes( editor ) ).toMatchObject( { octaveOffset: -1 } );
		} );

		test( 'should update instrument with the keyboard', async ( { editor, pageUtils } ) => {
			await editor.insertBlock( { name: BLOCK_NAME } );
			const select = editor.canvas.getByRole( 'combobox', { name: 'Instrument' } );
			await select.focus();
			await pageUtils.pressKeys( 'Enter' );
			await pageUtils.pressKeys( 'ArrowDown', { times: 14 } );
			await pageUtils.pressKeys( 'Enter' );

			// Pressing a piano key should not remove focus.
			await pageUtils.pressKeys( 'z' );
			await expect( select ).toBeFocused();

			await expect
				.poll( () => getBlockAttributes( editor ) )
				.toMatchObject( { instrument: 'synthesizer' } );
		} );

		test( 'should update synthesizer setting with the keyboard', async ( {
			editor,
			page,
			pageUtils,
		} ) => {
			await editor.insertBlock( {
				name: BLOCK_NAME,
				attributes: { instrument: 'synthesizer' },
			} );
			const button = editor.canvas.getByRole( 'button', { name: 'Synthesizer Setting' } );
			await button.focus();
			await pageUtils.pressKeys( 'Enter' );
			await expect( page.getByRole( 'combobox', { name: 'Oscillator Type' } ) ).toBeFocused();
			await pageUtils.pressKeys( 'ArrowDown', { times: 2 } );
			// Attack, Decay, Sustain, Release
			for ( let index = 0; index < 4; index++ ) {
				await pageUtils.pressKeys( 'Tab' );
				await pageUtils.pressKeys( 'ArrowRight', { times: 2 } );
			}
			await pageUtils.pressKeys( 'Escape' );
			// Pressing the escape key in a popover rendered in the iframe editor does not
			// return focus to the anchor element, so explicitly focus the anchor element.
			// see: https://github.com/WordPress/gutenberg/issues/55413
			await button.focus();

			// Pressing a piano key should not remove focus.
			await pageUtils.pressKeys( 'z' );
			await expect( button ).toBeFocused();

			await expect
				.poll( () => getBlockAttributes( editor ) )
				.toMatchObject( {
					synthesizerSetting: {
						oscillator: { type: 'sawtooth' },
						envelope: { attack: 0.4, decay: 1.1, sustain: 0.6, release: 1.6 },
					},
				} );
		} );

		test( 'should update key layout with the keyboard', async ( { editor, pageUtils } ) => {
			await editor.insertBlock( { name: BLOCK_NAME } );
			const select = editor.canvas.getByRole( 'combobox', { name: 'Key Layout' } );
			await select.focus();
			await pageUtils.pressKeys( 'Enter' );
			await pageUtils.pressKeys( 'ArrowDown' );
			await pageUtils.pressKeys( 'Enter' );

			await expect
				.poll( () => getBlockAttributes( editor ) )
				.toMatchObject( { keyLayout: 'qwerty-2' } );
		} );

		test( 'should update key indicator with the keyboard', async ( { editor, pageUtils } ) => {
			await editor.insertBlock( { name: BLOCK_NAME } );
			const select = editor.canvas.getByRole( 'combobox', { name: 'Key Indicator' } );
			await select.focus();
			await pageUtils.pressKeys( 'Enter' );
			await pageUtils.pressKeys( 'ArrowDown' );
			await pageUtils.pressKeys( 'Enter' );

			await expect
				.poll( () => getBlockAttributes( editor ) )
				.toMatchObject( { keyIndicator: 'spn' } );
		} );
	} );

	test( 'should update attributes in the block sidebar', async ( { editor, page } ) => {
		await editor.insertBlock( { name: BLOCK_NAME } );
		await editor.openDocumentSettingsSidebar();
		await page.getByLabel( 'Display on the front end' ).click();

		await expect.poll( () => getBlockAttributes( editor ) ).toMatchObject( { showOnFront: true } );
	} );
} );

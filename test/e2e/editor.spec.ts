/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should update attributes related to sound using only the keyboard', async ( {
		editor,
		pageUtils,
	} ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		// Volume
		await expect( editor.canvas.getByRole( 'slider', { name: 'Volume' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'ArrowLeft', { times: 3 } );

		// Octave Offset
		await pageUtils.pressKeys( 'Tab' );
		await expect( editor.canvas.getByRole( 'button', { name: 'Decrease Octave' } ) ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );

		// Instrument
		await pageUtils.pressKeys( 'Tab', { times: 2 } );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Instrument' } ) ).toBeFocused();
		await editor.canvas
			.getByRole( 'combobox', { name: 'Instrument' } )
			.selectOption( 'synthesizer' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );

		// Synthesizer Settings
		const synthesizerSettings = editor.canvas.getByRole( 'button', {
			name: 'Synthesizer Settings',
		} );
		await pageUtils.pressKeys( 'Tab' );
		await expect( synthesizerSettings ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await expect( synthesizerSettings ).toHaveAttribute( 'aria-pressed', 'true' );
		await pageUtils.pressKeys( 'Tab' );
		await expect(
			editor.canvas.getByRole( 'combobox', { name: 'Oscillator Type' } )
		).toBeFocused();
		await pageUtils.pressKeys( 'ArrowDown', { times: 2 } );
		for ( let index = 0; index < 4; index++ ) {
			await pageUtils.pressKeys( 'Tab' );
			await pageUtils.pressKeys( 'ArrowRight', { times: 2 } );
		}
		await pageUtils.pressKeys( 'shift+Tab', { times: 5 } );
		await expect( synthesizerSettings ).toBeFocused();
		await pageUtils.pressKeys( 'Enter' );
		await expect( synthesizerSettings ).toHaveAttribute( 'aria-pressed', 'false' );
		// Pressing a piano key should not remove focus.
		await pageUtils.pressKeys( 'z' );

		// Key Layout
		await pageUtils.pressKeys( 'Tab' );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Key Layout' } ) ).toBeFocused();
		await editor.canvas.getByRole( 'combobox', { name: 'Key Layout' } ).selectOption( 'qwerty-2' );

		// Key Label
		await pageUtils.pressKeys( 'Tab' );
		await expect( editor.canvas.getByRole( 'combobox', { name: 'Key Label' } ) ).toBeFocused();
		await editor.canvas.getByRole( 'combobox', { name: 'Key Label' } ).selectOption( 'spn' );

		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:piano-block/piano {"volume":-0.3,"octaveOffset":-1,"instrument":"synthesizer","synthesizerSetting":{"oscillator":{"type":"sawtooth"},"envelope":{"attack":0.4,"decay":1.1,"sustain":0.6,"release":1.6}},"keyLayout":"qwerty-2","keyIndicator":"spn"} /-->`
		);
	} );

	test( 'should play notes while focus is in the synthesizer settings', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		await editor.canvas
			.getByRole( 'combobox', { name: 'Instrument' } )
			.selectOption( 'synthesizer' );
		await editor.canvas.getByRole( 'button', { name: 'Synthesizer Settings' } ).click();
		const oscillatorType = editor.canvas.getByRole( 'combobox', { name: 'Oscillator Type' } );
		await oscillatorType.focus();

		// The first key press only unlocks audio, so keep pressing the key until the
		// synthesizer is ready.
		const key = editor.canvas.getByRole( 'button', { name: 'Note: C3' } );
		await expect( async () => {
			await page.keyboard.up( 'z' );
			await page.keyboard.down( 'z' );
			await expect( key ).toHaveClass( /is-pressed/, { timeout: 500 } );
		} ).toPass();
		await page.keyboard.up( 'z' );
		await expect( key ).not.toHaveClass( /is-pressed/ );
		await expect( oscillatorType ).toBeFocused();

		await page.keyboard.press( 's' );
		await expect( oscillatorType ).toHaveValue( 'sine' );
	} );

	test( 'should update attributes in the block sidebar', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'switch', { name: 'Display on the front end' } ).click();
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:piano-block/piano {"showOnFront":true} /-->`
		);
	} );

	test( 'should hide the sustain pedal toggle when the synthesizer is selected', async ( {
		editor,
	} ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		const toggle = editor.canvas.getByRole( 'button', { name: 'Sustain' } );
		await expect( toggle ).toBeVisible();
		await editor.canvas
			.getByRole( 'combobox', { name: 'Instrument' } )
			.selectOption( 'synthesizer' );
		await expect( toggle ).toBeHidden();
	} );

	test( 'should update the key labels when the key layout is changed', async ( { editor } ) => {
		await editor.insertBlock( { name: 'piano-block/piano' } );
		const key = editor.canvas.getByRole( 'button', { name: 'Note: C#4' } );
		await expect( key ).toHaveText( 'l 2' );
		await editor.canvas.getByRole( 'combobox', { name: 'Key Layout' } ).selectOption( 'qwerty-2' );
		await expect( key ).toHaveText( 'l 1' );
	} );
} );

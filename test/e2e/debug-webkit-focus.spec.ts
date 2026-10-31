/**
 * Temporary test to investigate why the keyboard test fails in WebKit on Ubuntu 26.04.
 * It only runs when DEBUG_WEBKIT_FOCUS is set, and logs where the focus is after each step.
 */

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Debug: WebKit focus', () => {
	test.skip( ! process.env.DEBUG_WEBKIT_FOCUS, 'Only runs when DEBUG_WEBKIT_FOCUS is set.' );

	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'log the focused element while moving focus with arrow keys', async ( {
		editor,
		page,
		pageUtils,
	} ) => {
		page.on( 'console', ( message ) =>
			// eslint-disable-next-line no-console
			console.log( `[console:${ message.type() }] ${ message.text() }` )
		);
		page.on( 'pageerror', ( error ) =>
			// eslint-disable-next-line no-console
			console.log( `[pageerror] ${ error.message }` )
		);

		const logFocus = async ( step: string ) => {
			const canvas = page.frame( { name: 'editor-canvas' } );
			const describe = ( element: Element | null ) => {
				if ( ! element ) {
					return 'null';
				}
				return [
					element.tagName.toLowerCase(),
					element.id && `#${ element.id }`,
					element.getAttribute( 'class' ) && `.${ element.getAttribute( 'class' ) }`,
					element.getAttribute( 'role' ) && `[role=${ element.getAttribute( 'role' ) }]`,
					element.getAttribute( 'aria-label' ) &&
						`[aria-label=${ element.getAttribute( 'aria-label' ) }]`,
				]
					.filter( Boolean )
					.join( '' );
			};
			const top = await page.evaluate( `(${ describe.toString() })(document.activeElement)` );
			const inner = canvas
				? await canvas.evaluate( `(${ describe.toString() })(document.activeElement)` )
				: 'no canvas';
			// eslint-disable-next-line no-console
			console.log( `[focus] ${ step }: top=${ top } canvas=${ inner }` );
		};

		// eslint-disable-next-line no-console
		console.log( `[userAgent] ${ await page.evaluate( () => navigator.userAgent ) }` );

		await editor.insertBlock( { name: 'piano-block/piano' } );
		await logFocus( 'after insertBlock' );

		for ( let index = 1; index <= 4; index++ ) {
			await pageUtils.pressKeys( 'ArrowRight' );
			await logFocus( `after ArrowRight #${ index }` );
		}

		// Check whether the slider can receive focus at all.
		const slider = editor.canvas.getByRole( 'slider', { name: 'Volume' } );
		// eslint-disable-next-line no-console
		console.log( `[slider] count=${ await slider.count() }` );
		await slider.focus();
		await logFocus( 'after slider.focus()' );
		await expect( slider ).toBeFocused();

		const start = Date.now();
		await page.close();
		// eslint-disable-next-line no-console
		console.log( `[teardown] page.close() took ${ Date.now() - start }ms` );
	} );
} );

/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { KEYBOARD_LAYOUTS } from '../../src/keyboard-layout';

describe( 'KEYBOARD_LAYOUTS', () => {
	it( 'has unique layout values', () => {
		const values = KEYBOARD_LAYOUTS.map( ( { value } ) => value );
		expect( new Set( values ).size ).toBe( values.length );
	} );

	describe.each( KEYBOARD_LAYOUTS )( '$value', ( { keys } ) => {
		it( 'has 29 keys', () => {
			expect( keys ).toHaveLength( 29 );
		} );

		it( 'covers C3 to E5 chromatically in order', () => {
			const notes = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
			const expected = Array.from( { length: 29 }, ( _, i ) => ( {
				note: notes[ i % 12 ],
				octave: 3 + Math.floor( i / 12 ),
			} ) );
			expect( keys.map( ( { note, octave } ) => ( { note, octave } ) ) ).toEqual( expected );
		} );

		it( 'has no duplicate key names', () => {
			const names = keys.flatMap( ( { name } ) => name );
			expect( names.filter( ( name, i ) => names.indexOf( name ) !== i ) ).toEqual( [] );
		} );
	} );
} );

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Key } from './constants';

const NOTES = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
const START_OCTAVE = 3;

// Create the 29 keys from C3 to E5, given the keyboard key names for each key.
const createKeys = ( names: string[][] ): Key[] =>
	names.map( ( name, index ) => {
		const note = NOTES[ index % NOTES.length ];
		return {
			note,
			octave: START_OCTAVE + Math.floor( index / NOTES.length ),
			isBlackKey: note.endsWith( '#' ),
			name,
		};
	} );

export const KEYBOARD_LAYOUTS = [
	{
		label: __( 'QWERTY 1', 'piano-block' ),
		value: 'qwerty-1',
		// prettier-ignore
		keys: createKeys( [
			[ 'z' ], [ 's' ], [ 'x' ], [ 'd' ], [ 'c' ], [ 'v' ], [ 'g' ], [ 'b' ], [ 'h' ], [ 'n' ], [ 'j' ], [ 'm' ],
			[ ',', 'q' ], [ 'l', '2' ], [ '.', 'w' ], [ '3' ], [ 'e' ], [ 'r' ], [ '5' ], [ 't' ], [ '6' ], [ 'y' ], [ '7' ], [ 'u' ],
			[ 'i' ], [ '9' ], [ 'o' ], [ '0' ], [ 'p' ],
		] ),
	},
	{
		label: __( 'QWERTY 2', 'piano-block' ),
		value: 'qwerty-2',
		// prettier-ignore
		keys: createKeys( [
			[ 'z' ], [ 's' ], [ 'x' ], [ 'd' ], [ 'c' ], [ 'v' ], [ 'g' ], [ 'b' ], [ 'h' ], [ 'n' ], [ 'j' ], [ 'm' ],
			[ ',', 'q' ], [ 'l', '1' ], [ '.', 'w' ], [ '2' ], [ 'e' ], [ 'r' ], [ '4' ], [ 't' ], [ '5' ], [ 'y' ], [ '6' ], [ 'u' ],
			[ 'i' ], [ '8' ], [ 'o' ], [ '9' ], [ 'p' ],
		] ),
	},
	{
		label: __( 'AZERTY 1', 'piano-block' ),
		value: 'azerty-1',
		// prettier-ignore
		keys: createKeys( [
			[ '<' ], [ 'q' ], [ 'w' ], [ 's' ], [ 'x' ], [ 'c' ], [ 'f' ], [ 'v' ], [ 'g' ], [ 'b' ], [ 'h' ], [ 'n' ],
			[ ',', 'a' ], [ 'k', '&' ], [ ';', 'z' ], [ 'é' ], [ 'e' ], [ 'r' ], [ "'" ], [ 't' ], [ '(' ], [ 'y' ], [ '-' ], [ 'u' ],
			[ 'i' ], [ '_' ], [ 'o' ], [ 'ç' ], [ 'p' ],
		] ),
	},
];

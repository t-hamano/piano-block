/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export interface BlockAttributes {
	volume: number;
	octaveOffset: number;
	instrument: string;
	useSustainPedal: boolean;
}

export const MIN_VOLUME = -10 as const;
export const MAX_VOLUME = 5 as const;
export const DEFAULT_INSTRUMENT = 'acoustic-piano' as const;
export const KEYBOARD_WIDTH = 850 as const;
export const KEYBOARD_PADDING = 16 as const;

export const INSTRUMENTS = [
	{
		label: __( 'Acoustic Piano', 'piano-block' ),
		value: 'acoustic-piano',
		notes: [ 'A1', 'D2', 'A2', 'D3', 'A3', 'D4', 'A4', 'D5', 'A5', 'D6', 'A6' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Electric Piano1', 'piano-block' ),
		value: 'electric-piano-1',
		notes: [ 'A1', 'A2', 'A3', 'A4', 'A5' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Electric Piano2', 'piano-block' ),
		value: 'electric-piano-2',
		notes: [ 'A1', 'C2', 'F2', 'B2', 'E3', 'Gs3', 'Cs4', 'E4', 'G4', 'Cs5', 'G5' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Organ', 'piano-block' ),
		value: 'organ',
		notes: [ 'G2', 'C3', 'G3', 'C4', 'G4', 'C5', 'G5' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Electric Guitar', 'piano-block' ),
		value: 'electric-guitar',
		notes: [ 'Cs2', 'A2', 'C3', 'A3', 'C4', 'A4', 'C5', 'A5', 'C6' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Acoustic Guitar', 'piano-block' ),
		value: 'acoustic-guitar',
		notes: [ 'Cs2', 'A2', 'C3', 'A3', 'C4', 'A4', 'C5', 'A5', 'C6' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Electric Bass', 'piano-block' ),
		value: 'electric-bass',
		notes: [ 'Cs1', 'G1', 'Cs2', 'G2', 'Cs3', 'G3', 'Cs4' ],
		octaveOffset: -1,
	},
	{
		label: __( 'Acoustic Bass', 'piano-block' ),
		value: 'acoustic-bass',
		notes: [ 'C1', 'Ds1', 'Fs1', 'A1', 'C2', 'Ds2', 'Fs2', 'A3', 'C3', 'Ds3', 'Fs3', 'C4' ],
		octaveOffset: -1,
	},
	{
		label: __( 'Muted Trumpet', 'piano-block' ),
		value: 'muted-trumpet',
		notes: [ 'As3', 'C4', 'Ds4', 'Gs4', 'As4', 'D5', 'F5', 'A5' ],
		octaveOffset: 1,
	},
	{
		label: __( 'Sax', 'piano-block' ),
		value: 'sax',
		notes: [ 'Cs2', 'E2', 'G2', 'As2', 'Cs3', 'E3', 'G3', 'As3', 'Cs4', 'E4', 'G4' ],
		octaveOffset: 0,
	},
	{
		label: __( 'Flute', 'piano-block' ),
		value: 'flute',
		notes: [ 'C4', 'E4', 'A4', 'C5', 'E5', 'A5', 'C6', 'E6', 'A6' ],
		octaveOffset: 2,
	},
	{
		label: __( 'Violin', 'piano-block' ),
		value: 'violin',

		notes: [ 'A3', 'C4', 'E4', 'A4', 'C5', 'E5', 'A5', 'C6', 'E6', 'A6' ],
		octaveOffset: 1,
	},
	{
		label: __( 'Harp', 'piano-block' ),
		value: 'harp',
		notes: [ 'D2', 'A2', 'E3', 'B3', 'F4', 'C5', 'G5', 'D6', 'A6' ],
		octaveOffset: 1,
	},
	{
		label: __( 'Xylophone', 'piano-block' ),
		value: 'xylophone',
		notes: [ 'G4', 'C5', 'G5', 'C6', 'G6', 'C7', 'G7' ],
		octaveOffset: 1,
	},
];

export const OCTAVE_OFFSETS = [
	{
		label: __( '-2', 'piano-block' ),
		value: -2,
	},
	{
		label: __( '-1', 'piano-block' ),
		value: -1,
	},
	{
		label: __( '0', 'piano-block' ),
		value: 0,
	},
	{
		label: __( '+1', 'piano-block' ),
		value: 1,
	},
	{
		label: __( '+2', 'piano-block' ),
		value: 2,
	},
] as const;

export const KEYS = [
	{ note: 'C', octave: 3, isBlackKey: false, name: [ 'z' ] },
	{ note: 'C#', octave: 3, isBlackKey: true, name: [ 's' ] },
	{ note: 'D', octave: 3, isBlackKey: false, name: [ 'x' ] },
	{ note: 'D#', octave: 3, isBlackKey: true, name: [ 'd' ] },
	{ note: 'E', octave: 3, isBlackKey: false, name: [ 'c' ] },
	{ note: 'F', octave: 3, isBlackKey: false, name: [ 'v' ] },
	{ note: 'F#', octave: 3, isBlackKey: true, name: [ 'g' ] },
	{ note: 'G', octave: 3, isBlackKey: false, name: [ 'b' ] },
	{ note: 'G#', octave: 3, isBlackKey: true, name: [ 'h' ] },
	{ note: 'A', octave: 3, isBlackKey: false, name: [ 'n' ] },
	{ note: 'A#', octave: 3, isBlackKey: true, name: [ 'j' ] },
	{ note: 'B', octave: 3, isBlackKey: false, name: [ 'm' ] },
	{ note: 'C', octave: 4, isBlackKey: false, name: [ ',', 'q' ] },
	{ note: 'C#', octave: 4, isBlackKey: true, name: [ 'l', '2' ] },
	{ note: 'D', octave: 4, isBlackKey: false, name: [ '.', 'w' ] },
	{ note: 'D#', octave: 4, isBlackKey: true, name: [ '3' ] },
	{ note: 'E', octave: 4, isBlackKey: false, name: [ 'e' ] },
	{ note: 'F', octave: 4, isBlackKey: false, name: [ 'r' ] },
	{ note: 'F#', octave: 4, isBlackKey: true, name: [ '5' ] },
	{ note: 'G', octave: 4, isBlackKey: false, name: [ 't' ] },
	{ note: 'G#', octave: 4, isBlackKey: true, name: [ '6' ] },
	{ note: 'A', octave: 4, isBlackKey: false, name: [ 'y' ] },
	{ note: 'A#', octave: 4, isBlackKey: true, name: [ '7' ] },
	{ note: 'B', octave: 4, isBlackKey: false, name: [ 'u' ] },
	{ note: 'C', octave: 5, isBlackKey: false, name: [ 'i' ] },
	{ note: 'C#', octave: 5, isBlackKey: true, name: [ '9' ] },
	{ note: 'D', octave: 5, isBlackKey: false, name: [ 'o' ] },
	{ note: 'D#', octave: 5, isBlackKey: true, name: [ '0' ] },
	{ note: 'E', octave: 5, isBlackKey: false, name: [ 'p' ] },
] as const;

export type Instrument = typeof INSTRUMENTS[ number ];
export type Key = typeof KEYS[ number ];

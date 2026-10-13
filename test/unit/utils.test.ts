/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { DEFAULT_ENVELOPE, DEFAULT_SETTINGS } from '../../src/constants';
import type { BlockAttributes } from '../../src/constants';
import { getNormalizedVolume, getSamplerFileNames, parseViewAttributes } from '../../src/utils';

describe( 'getSamplerFileNames', () => {
	it( 'maps notes to mp3 file names', () => {
		expect( getSamplerFileNames( [ 'A1', 'D2' ] ) ).toEqual( {
			A1: 'A1.mp3',
			D2: 'D2.mp3',
		} );
	} );

	it( 'converts "s" in note names to "#"', () => {
		expect( getSamplerFileNames( [ 'Cs2', 'Fs3' ] ) ).toEqual( {
			'C#2': 'Cs2.mp3',
			'F#3': 'Fs3.mp3',
		} );
	} );

	it( 'returns an empty object for no notes', () => {
		expect( getSamplerFileNames( [] ) ).toEqual( {} );
	} );
} );

describe( 'getNormalizedVolume', () => {
	const createSettings = ( settings: Partial< BlockAttributes > ): BlockAttributes => ( {
		...DEFAULT_SETTINGS,
		...settings,
	} );

	it( 'returns the volume as is for an instrument without an offset', () => {
		expect( getNormalizedVolume( 3, createSettings( { instrument: 'acoustic-piano' } ) ) ).toBe(
			3
		);
	} );

	it( 'treats an undefined volume as 0', () => {
		expect(
			getNormalizedVolume( undefined, createSettings( { instrument: 'acoustic-piano' } ) )
		).toBe( 0 );
	} );

	it( 'returns the volume as is for an unknown instrument', () => {
		expect(
			getNormalizedVolume(
				2,
				createSettings( { instrument: 'unknown' as BlockAttributes[ 'instrument' ] } )
			)
		).toBe( 2 );
	} );

	it( 'applies the synthesizer and oscillator type offsets', () => {
		expect(
			getNormalizedVolume(
				1,
				createSettings( {
					instrument: 'synthesizer',
					synthesizerSetting: { oscillator: { type: 'square' } },
				} )
			)
		).toBe( 1 - 5 - 18 );
	} );

	it( 'ignores the oscillator type offset for non-synthesizer instruments', () => {
		expect(
			getNormalizedVolume(
				1,
				createSettings( {
					instrument: 'acoustic-piano',
					synthesizerSetting: { oscillator: { type: 'square' } },
				} )
			)
		).toBe( 1 );
	} );
} );

const createNode = ( attributes: Record< string, string > ) => ( {
	getAttribute: ( name: string ) => attributes[ name ] ?? null,
} );

describe( 'parseViewAttributes', () => {
	it( 'parses all data attributes', () => {
		expect(
			parseViewAttributes(
				createNode( {
					'data-volume': '-2.5',
					'data-use-sustain-pedal': '1',
					'data-octave-offset': '-1',
					'data-instrument': 'synthesizer',
					'data-key-layout': 'azerty-1',
					'data-key-indicator': 'spn',
					'data-synthesizer-setting': JSON.stringify( {
						oscillator: { type: 'square' },
						envelope: { attack: 0.1, decay: '0.2', sustain: 0, release: 3 },
					} ),
				} )
			)
		).toEqual( {
			volume: -2.5,
			useSustainPedal: true,
			octaveOffset: -1,
			instrument: 'synthesizer',
			keyLayout: 'azerty-1',
			keyIndicator: 'spn',
			synthesizerSetting: {
				oscillator: { type: 'square' },
				envelope: { attack: 0.1, decay: 0.2, sustain: 0, release: 3 },
			},
			showOnFront: true,
		} );
	} );

	it( 'falls back to defaults when attributes are missing', () => {
		expect( parseViewAttributes( createNode( {} ) ) ).toEqual( {
			volume: NaN,
			useSustainPedal: false,
			octaveOffset: NaN,
			instrument: DEFAULT_SETTINGS.instrument,
			keyLayout: DEFAULT_SETTINGS.keyLayout,
			keyIndicator: DEFAULT_SETTINGS.keyIndicator,
			synthesizerSetting: {
				oscillator: { type: 'sine' },
				envelope: DEFAULT_ENVELOPE,
			},
			showOnFront: true,
		} );
	} );

	it( 'returns null for an unknown instrument', () => {
		expect( parseViewAttributes( createNode( { 'data-instrument': 'unknown' } ) ) ).toBeNull();
	} );

	it( 'accepts an empty key indicator', () => {
		expect( parseViewAttributes( createNode( { 'data-key-indicator': '' } ) )?.keyIndicator ).toBe(
			''
		);
	} );

	it( 'falls back to the default key indicator for an unknown value', () => {
		expect(
			parseViewAttributes( createNode( { 'data-key-indicator': 'unknown' } ) )?.keyIndicator
		).toBe( DEFAULT_SETTINGS.keyIndicator );
	} );

	it( 'falls back to default envelope values that are null or not numeric', () => {
		expect(
			parseViewAttributes(
				createNode( {
					'data-synthesizer-setting': JSON.stringify( {
						envelope: { attack: null, decay: 'abc', sustain: 0.8 },
					} ),
				} )
			)?.synthesizerSetting.envelope
		).toEqual( {
			attack: DEFAULT_ENVELOPE.attack,
			decay: DEFAULT_ENVELOPE.decay,
			sustain: 0.8,
			release: DEFAULT_ENVELOPE.release,
		} );
	} );
} );

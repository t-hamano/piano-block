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
		const volume = 1;
		const synthesizerVolumeOffset = -5;
		const squareVolumeOffset = -18;

		expect(
			getNormalizedVolume(
				volume,
				createSettings( {
					instrument: 'synthesizer',
					synthesizerSetting: { oscillator: { type: 'square' } },
				} )
			)
		).toBe( volume + synthesizerVolumeOffset + squareVolumeOffset );
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

const createNode = ( settings?: unknown ) => ( {
	getAttribute: ( name: string ) => {
		if ( name !== 'data-settings' || settings === undefined ) {
			return null;
		}
		return typeof settings === 'string' ? settings : JSON.stringify( settings );
	},
} );

const DEFAULT_VIEW_ATTRIBUTES = {
	volume: DEFAULT_SETTINGS.volume,
	useSustainPedal: false,
	octaveOffset: DEFAULT_SETTINGS.octaveOffset,
	instrument: DEFAULT_SETTINGS.instrument,
	keyLayout: DEFAULT_SETTINGS.keyLayout,
	keyIndicator: DEFAULT_SETTINGS.keyIndicator,
	synthesizerSetting: {
		oscillator: { type: 'sine' },
		envelope: DEFAULT_ENVELOPE,
	},
	showOnFront: true,
};

describe( 'parseViewAttributes', () => {
	it( 'parses all settings', () => {
		expect(
			parseViewAttributes(
				createNode( {
					volume: -2.5,
					useSustainPedal: true,
					octaveOffset: -1,
					instrument: 'synthesizer',
					keyLayout: 'azerty-1',
					keyIndicator: 'spn',
					synthesizerSetting: {
						oscillator: { type: 'square' },
						envelope: { attack: 0.1, decay: '0.2', sustain: 0, release: 3 },
					},
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

	it( 'falls back to defaults when settings are missing', () => {
		expect( parseViewAttributes( createNode() ) ).toEqual( DEFAULT_VIEW_ATTRIBUTES );
		expect( parseViewAttributes( createNode( {} ) ) ).toEqual( DEFAULT_VIEW_ATTRIBUTES );
	} );

	it( 'falls back to defaults when settings are not valid JSON', () => {
		expect( parseViewAttributes( createNode( '{invalid' ) ) ).toEqual( DEFAULT_VIEW_ATTRIBUTES );
		expect( parseViewAttributes( createNode( 'null' ) ) ).toEqual( DEFAULT_VIEW_ATTRIBUTES );
	} );

	it( 'returns null for an unknown instrument', () => {
		expect( parseViewAttributes( createNode( { instrument: 'unknown' } ) ) ).toBeNull();
	} );

	it( 'accepts an empty key indicator', () => {
		expect( parseViewAttributes( createNode( { keyIndicator: '' } ) )?.keyIndicator ).toBe( '' );
	} );

	it( 'falls back to defaults for unknown enum values', () => {
		const attributes = parseViewAttributes(
			createNode( {
				keyLayout: 'unknown',
				keyIndicator: 'unknown',
				synthesizerSetting: { oscillator: { type: 'unknown' } },
			} )
		);
		expect( attributes?.keyLayout ).toBe( DEFAULT_SETTINGS.keyLayout );
		expect( attributes?.keyIndicator ).toBe( DEFAULT_SETTINGS.keyIndicator );
		expect( attributes?.synthesizerSetting.oscillator.type ).toBe( 'sine' );
	} );

	it( 'falls back to defaults for values that are not numeric', () => {
		const attributes = parseViewAttributes(
			createNode( {
				volume: 'abc',
				octaveOffset: null,
				synthesizerSetting: {
					envelope: { attack: null, decay: 'abc', sustain: 0.8 },
				},
			} )
		);
		expect( attributes?.volume ).toBe( DEFAULT_SETTINGS.volume );
		expect( attributes?.octaveOffset ).toBe( DEFAULT_SETTINGS.octaveOffset );
		expect( attributes?.synthesizerSetting.envelope ).toEqual( {
			attack: DEFAULT_ENVELOPE.attack,
			decay: DEFAULT_ENVELOPE.decay,
			sustain: 0.8,
			release: DEFAULT_ENVELOPE.release,
		} );
	} );
} );

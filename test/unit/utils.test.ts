/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { DEFAULT_SETTINGS } from '../../src/constants';
import type { BlockAttributes } from '../../src/constants';
import { getNormalizedVolume, getSamplerFileNames } from '../../src/utils';

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

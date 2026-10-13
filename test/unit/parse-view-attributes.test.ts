/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { DEFAULT_ENVELOPE, DEFAULT_SETTINGS } from '../../src/constants';
import { parseViewAttributes } from '../../src/parse-view-attributes';

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

/// <reference types="node" />

/**
 * External dependencies
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { INSTRUMENTS } from '../../src/constants';

const instrumentsDir = resolve( __dirname, '../../assets/instruments' );
const sampledInstruments = INSTRUMENTS.filter( ( instrument ) => 'notes' in instrument );

describe( 'INSTRUMENTS', () => {
	it( 'has an asset directory for each sampled instrument and no other', () => {
		expect( readdirSync( instrumentsDir ).sort() ).toEqual(
			sampledInstruments.map( ( { value } ) => value ).sort()
		);
	} );

	describe.each( sampledInstruments )( '$value', ( { value, notes } ) => {
		it( 'has notes matching the mp3 files', () => {
			const files = readdirSync( resolve( instrumentsDir, value ) );
			expect( notes.map( ( note ) => `${ note }.mp3` ).sort() ).toEqual( files.sort() );
		} );
	} );
} );

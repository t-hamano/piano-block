/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import metadata from '../../src/block.json';
import { DEFAULT_SETTINGS } from '../../src/constants';

describe( 'block.json', () => {
	it( 'defines attribute defaults matching DEFAULT_SETTINGS', () => {
		const defaults = Object.fromEntries(
			Object.entries( metadata.attributes ).map( ( [ name, schema ] ) => [ name, schema.default ] )
		);

		expect( defaults ).toEqual( DEFAULT_SETTINGS );
	} );
} );

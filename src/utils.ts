/**
 * Internal dependencies
 */
import type { Instrument } from './constants';

/**
 * Return a object of audio URLs from notes of Tone.js Sampler.
 *
 * @param  instrument Instrument object.
 * @return Object of audio URLs.
 */
export function getSamplerUrls( instrument: Instrument ) {
	if ( ! instrument.notes || ! Array.isArray( instrument.notes ) ) {
		return {};
	}

	return instrument.notes.reduce( ( accumulator: { [ key: string ]: string }, note: string ) => {
		return {
			...accumulator,
			[ note.replace( 's', '#' ) ]: `${ note }.mp3`,
		};
	}, {} );
}

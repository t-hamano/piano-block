/**
 * Internal dependencies
 */
import { INSTRUMENTS, OSCILLATOR_TYPES } from './constants';
import type { BlockAttributes, Instrument } from './constants';

/**
 * Return a object of audio URLs from notes of Tone.js Sampler.
 *
 * @param instrument Instrument object.
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

/**
 * Return a normalized volume according to instrument or synthesizer oscillator type.
 *
 * @param newVolume New volume.
 * @param settings  Settings.
 * @return number Normalized volume.
 */
export function getNormalizedVolume(
	newVolume: number | undefined,
	settings: BlockAttributes
): number {
	const { instrument, synthesizerSetting } = settings;

	let normalizedVolume = newVolume || 0;
	const instrumentSetting = INSTRUMENTS.find( ( { value } ) => value === instrument );

	if ( ! instrumentSetting ) {
		return normalizedVolume;
	}

	normalizedVolume += instrumentSetting.volumeOffset;

	if ( instrument === 'synthesizer' && synthesizerSetting.oscillator?.type ) {
		const oscillatorType = OSCILLATOR_TYPES.find(
			( { value } ) => value === synthesizerSetting.oscillator.type
		);
		normalizedVolume += oscillatorType?.volumeOffset || 0;
	}

	return normalizedVolume;
}

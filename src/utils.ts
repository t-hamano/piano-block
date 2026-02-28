/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { INSTRUMENTS, OSCILLATOR_TYPES } from './constants';
import type { BlockAttributes } from './constants';

/**
 * Return a object of audio file names from notes of Tone.js Sampler.
 *
 * @param notes Notes.
 * @return Object of audio URLs.
 */
export function getSamplerFileNames( notes: string[] ) {
	if ( ! notes || ! Array.isArray( notes ) ) {
		return {};
	}

	return notes.reduce( ( accumulator: { [ key: string ]: string }, note: string ) => {
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

export function useToolsPanelDropdownMenuProps() {
	const isMobile = useViewportMatch( 'medium', '<' );
	return ! isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					offset: 259,
				},
				// TODO: Once the type is fixed upstream, remove this property.
				// See: https://github.com/WordPress/gutenberg/pull/76027
				label: '',
		  }
		: // TODO: Once the type is fixed upstream, remove this property.
		  // See: https://github.com/WordPress/gutenberg/pull/76027
		  { label: '' };
}

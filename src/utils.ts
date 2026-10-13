/**
 * Internal dependencies
 */
import {
	DEFAULT_ENVELOPE,
	DEFAULT_OSCILLATOR_TYPE,
	DEFAULT_SETTINGS,
	INSTRUMENTS,
	KEY_INDICATORS,
	OSCILLATOR_TYPES,
} from './constants';
import type { BlockAttributes } from './constants';

/**
 * Return a object of audio file names from notes of Tone.js Sampler.
 *
 * @param notes Notes.
 * @return Object of audio URLs.
 */
export function getSamplerFileNames( notes: string[] ) {
	return Object.fromEntries(
		notes.map( ( note ) => [ note.replace( 's', '#' ), `${ note }.mp3` ] )
	);
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

function parseEnvelopeValue( value: unknown, defaultValue: number ): number {
	if ( value === null || value === undefined ) {
		return defaultValue;
	}
	const parsed = parseFloat( value as string );
	return Number.isNaN( parsed ) ? defaultValue : parsed;
}

/**
 * Parse block attributes from the data attributes of a front-end block element.
 *
 * @param domNode Block element.
 * @return Block attributes, or null if the instrument is not allowed.
 */
export function parseViewAttributes(
	domNode: Pick< Element, 'getAttribute' >
): BlockAttributes | null {
	const instrument = domNode.getAttribute( 'data-instrument' ) || DEFAULT_SETTINGS.instrument;

	const allowedInstrument = INSTRUMENTS.find( ( { value } ) => value === instrument );
	if ( ! allowedInstrument ) {
		return null;
	}

	const volume = parseFloat( domNode.getAttribute( 'data-volume' ) || '' );
	const useSustainPedal = domNode.getAttribute( 'data-use-sustain-pedal' ) === '1';
	const octaveOffset = parseFloat( domNode.getAttribute( 'data-octave-offset' ) || '' );
	const keyLayout = domNode.getAttribute( 'data-key-layout' ) || DEFAULT_SETTINGS.keyLayout;
	const keyIndicatorAttr = domNode.getAttribute( 'data-key-indicator' );
	const keyIndicator =
		KEY_INDICATORS.find( ( { value } ) => value === keyIndicatorAttr )?.value ??
		DEFAULT_SETTINGS.keyIndicator;

	const synthesizerSetting = domNode.getAttribute( 'data-synthesizer-setting' );
	const parsedSynthesizerSetting = synthesizerSetting ? JSON.parse( synthesizerSetting ) : {};

	const { oscillator, envelope } = parsedSynthesizerSetting;

	const normalizedSynthesizerSetting = {
		oscillator: {
			type: oscillator?.type || DEFAULT_OSCILLATOR_TYPE,
		},
		envelope: {
			attack: parseEnvelopeValue( envelope?.attack, DEFAULT_ENVELOPE.attack ),
			decay: parseEnvelopeValue( envelope?.decay, DEFAULT_ENVELOPE.decay ),
			sustain: parseEnvelopeValue( envelope?.sustain, DEFAULT_ENVELOPE.sustain ),
			release: parseEnvelopeValue( envelope?.release, DEFAULT_ENVELOPE.release ),
		},
	};

	return {
		volume,
		useSustainPedal,
		octaveOffset,
		instrument: allowedInstrument.value,
		keyLayout,
		keyIndicator,
		synthesizerSetting: normalizedSynthesizerSetting,
		showOnFront: true,
	};
}

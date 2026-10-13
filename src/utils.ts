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
import { KEYBOARD_LAYOUTS } from './keyboard-layout';
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

function parseNumber( value: unknown, defaultValue: number ): number {
	if ( typeof value === 'number' ) {
		return Number.isFinite( value ) ? value : defaultValue;
	}
	if ( typeof value !== 'string' ) {
		return defaultValue;
	}
	const parsed = parseFloat( value );
	return Number.isNaN( parsed ) ? defaultValue : parsed;
}

function parseSettingsJson( json: string | null ): Record< string, any > {
	if ( ! json ) {
		return {};
	}
	try {
		const parsed = JSON.parse( json );
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}

/**
 * Parse block attributes from the `data-settings` attribute of a front-end block element.
 *
 * @param domNode Block element.
 * @return Block attributes, or null if the instrument is not allowed.
 */
export function parseViewAttributes(
	domNode: Pick< Element, 'getAttribute' >
): BlockAttributes | null {
	const settings = parseSettingsJson( domNode.getAttribute( 'data-settings' ) );

	const allowedInstrument = INSTRUMENTS.find(
		( { value } ) => value === ( settings.instrument ?? DEFAULT_SETTINGS.instrument )
	);
	if ( ! allowedInstrument ) {
		return null;
	}

	const keyLayout =
		KEYBOARD_LAYOUTS.find( ( { value } ) => value === settings.keyLayout )?.value ??
		DEFAULT_SETTINGS.keyLayout;
	const keyIndicator =
		KEY_INDICATORS.find( ( { value } ) => value === settings.keyIndicator )?.value ??
		DEFAULT_SETTINGS.keyIndicator;

	const { oscillator, envelope } = settings.synthesizerSetting ?? {};
	const oscillatorType =
		OSCILLATOR_TYPES.find( ( { value } ) => value === oscillator?.type )?.value ??
		DEFAULT_OSCILLATOR_TYPE;

	return {
		volume: parseNumber( settings.volume, DEFAULT_SETTINGS.volume ?? 0 ),
		useSustainPedal: settings.useSustainPedal === true,
		octaveOffset: parseNumber( settings.octaveOffset, DEFAULT_SETTINGS.octaveOffset ),
		instrument: allowedInstrument.value,
		keyLayout,
		keyIndicator,
		synthesizerSetting: {
			oscillator: {
				type: oscillatorType,
			},
			envelope: {
				attack: parseNumber( envelope?.attack, DEFAULT_ENVELOPE.attack ),
				decay: parseNumber( envelope?.decay, DEFAULT_ENVELOPE.decay ),
				sustain: parseNumber( envelope?.sustain, DEFAULT_ENVELOPE.sustain ),
				release: parseNumber( envelope?.release, DEFAULT_ENVELOPE.release ),
			},
		},
		showOnFront: true,
	};
}

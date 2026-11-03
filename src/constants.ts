/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

export type BlockAttributes = {
	volume: number | undefined;
	octaveOffset: number;
	instrument: ( typeof INSTRUMENTS )[ number ][ 'value' ];
	useSustainPedal: boolean;
	showOnFront: boolean;
	synthesizerSetting: {
		oscillator: {
			type: ( typeof OSCILLATOR_TYPES )[ number ][ 'value' ];
		};
		envelope?: {
			attack: number;
			decay: number;
			sustain: number;
			release: number;
		};
	};
	keyLayout: string;
	keyIndicator: ( typeof KEY_INDICATORS )[ number ][ 'value' ];
};

export const MIN_VOLUME = -10 as const;
export const MAX_VOLUME = 5 as const;
export const DEFAULT_INSTRUMENT = 'acoustic-piano' as const;
export const DEFAULT_OSCILLATOR_TYPE = 'sine' as const;

export const DEFAULT_ENVELOPE = {
	attack: 0.3,
	decay: 1.0,
	sustain: 0.5,
	release: 1.5,
};

export const DEFAULT_SETTINGS: BlockAttributes = {
	volume: 0,
	useSustainPedal: false,
	octaveOffset: 0,
	instrument: DEFAULT_INSTRUMENT,
	showOnFront: false,
	synthesizerSetting: {
		oscillator: {
			type: DEFAULT_OSCILLATOR_TYPE,
		},
		envelope: DEFAULT_ENVELOPE,
	},
	keyLayout: 'qwerty-1',
	keyIndicator: 'key',
};

export const INSTRUMENTS = [
	{
		label: _x( 'Acoustic Piano', 'instrument', 'piano-block' ),
		value: 'acoustic-piano',
		notes: [ 'A1', 'D2', 'A2', 'D3', 'A3', 'D4', 'A4', 'D5', 'A5', 'D6', 'A6' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Electric Piano 1', 'instrument', 'piano-block' ),
		value: 'electric-piano-1',
		notes: [ 'A1', 'A2', 'A3', 'A4', 'A5' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Electric Piano 2', 'instrument', 'piano-block' ),
		value: 'electric-piano-2',
		notes: [ 'A1', 'C2', 'F2', 'B2', 'E3', 'Gs3', 'Cs4', 'E4', 'G4', 'Cs5', 'G5' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Organ', 'instrument', 'piano-block' ),
		value: 'organ',
		notes: [ 'G2', 'C3', 'G3', 'C4', 'G4', 'C5', 'G5' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Electric Guitar', 'instrument', 'piano-block' ),
		value: 'electric-guitar',
		notes: [ 'Cs2', 'A2', 'C3', 'A3', 'C4', 'A4', 'C5', 'A5', 'C6' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Acoustic Guitar', 'instrument', 'piano-block' ),
		value: 'acoustic-guitar',
		notes: [ 'Cs2', 'A2', 'C3', 'A3', 'C4', 'A4', 'C5', 'A5', 'C6' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Electric Bass', 'instrument', 'piano-block' ),
		value: 'electric-bass',
		notes: [ 'Cs1', 'G1', 'Cs2', 'G2', 'Cs3', 'G3', 'Cs4' ],
		octaveOffset: -1,
		volumeOffset: 0,
	},
	{
		label: _x( 'Acoustic Bass', 'instrument', 'piano-block' ),
		value: 'acoustic-bass',
		// A2 is intentionally excluded because its timbre differs from the other samples.
		notes: [ 'C1', 'Ds1', 'Fs1', 'A1', 'C2', 'Ds2', 'Fs2', 'C3', 'Ds3', 'Fs3', 'A3', 'C4' ],
		octaveOffset: -1,
		volumeOffset: 0,
	},
	{
		label: _x( 'Muted Trumpet', 'instrument', 'piano-block' ),
		value: 'muted-trumpet',
		notes: [ 'As3', 'C4', 'Ds4', 'Gs4', 'As4', 'D5', 'F5', 'A5' ],
		octaveOffset: 1,
		volumeOffset: 0,
	},
	{
		label: _x( 'Sax', 'instrument', 'piano-block' ),
		value: 'sax',
		notes: [ 'Cs2', 'E2', 'G2', 'As2', 'Cs3', 'E3', 'G3', 'As3', 'Cs4', 'E4', 'G4' ],
		octaveOffset: 0,
		volumeOffset: 0,
	},
	{
		label: _x( 'Flute', 'instrument', 'piano-block' ),
		value: 'flute',
		notes: [ 'C4', 'E4', 'A4', 'C5', 'E5', 'A5', 'C6', 'E6', 'A6' ],
		octaveOffset: 2,
		volumeOffset: 0,
	},
	{
		label: _x( 'Violin', 'instrument', 'piano-block' ),
		value: 'violin',
		notes: [ 'A3', 'C4', 'E4', 'A4', 'C5', 'E5', 'A5', 'C6', 'E6', 'A6' ],
		octaveOffset: 1,
		volumeOffset: 0,
	},
	{
		label: _x( 'Harp', 'instrument', 'piano-block' ),
		value: 'harp',
		notes: [ 'D2', 'A2', 'E3', 'B3', 'F4', 'C5', 'G5', 'D6', 'A6' ],
		octaveOffset: 1,
		volumeOffset: 0,
	},
	{
		label: _x( 'Xylophone', 'instrument', 'piano-block' ),
		value: 'xylophone',
		notes: [ 'G4', 'C5', 'G5', 'C6', 'G6', 'C7', 'G7' ],
		octaveOffset: 1,
		volumeOffset: 0,
	},
	{
		label: _x( 'Synthesizer', 'instrument', 'piano-block' ),
		value: 'synthesizer',
		octaveOffset: 0,
		volumeOffset: -5,
	},
] as const;

export const OCTAVE_OFFSETS = [
	{
		label: '+2',
		value: 2,
	},
	{
		label: '+1',
		value: 1,
	},
	{
		label: '0',
		value: 0,
	},
	{
		label: '-1',
		value: -1,
	},
	{
		label: '-2',
		value: -2,
	},
] as const;

export const OSCILLATOR_TYPES = [
	{
		label: _x( 'Sine', 'oscillator waveform', 'piano-block' ),
		value: 'sine',
		volumeOffset: 0,
	},
	{
		label: _x( 'Square', 'oscillator waveform', 'piano-block' ),
		value: 'square',
		volumeOffset: -18,
	},
	{
		label: _x( 'Sawtooth', 'oscillator waveform', 'piano-block' ),
		value: 'sawtooth',
		volumeOffset: -12,
	},
	{
		label: _x( 'Triangle', 'oscillator waveform', 'piano-block' ),
		value: 'triangle',
		volumeOffset: 0,
	},
	{
		label: _x( 'Fat Sine', 'oscillator waveform', 'piano-block' ),
		value: 'fatsine',
		volumeOffset: +4,
	},
	{
		label: _x( 'Fat Square', 'oscillator waveform', 'piano-block' ),
		value: 'fatsquare',
		volumeOffset: -10,
	},
	{
		label: _x( 'Fat Sawtooth', 'oscillator waveform', 'piano-block' ),
		value: 'fatsawtooth',
		volumeOffset: -8,
	},
	{
		label: _x( 'Fat Triangle', 'oscillator waveform', 'piano-block' ),
		value: 'fattriangle',
		volumeOffset: 4,
	},
	{
		label: _x( 'FM Sine', 'oscillator waveform', 'piano-block' ),
		value: 'fmsine',
		volumeOffset: 0,
	},
	{
		label: _x( 'FM Square', 'oscillator waveform', 'piano-block' ),
		value: 'fmsquare',
		volumeOffset: -12,
	},
	{
		label: _x( 'FM Sawtooth', 'oscillator waveform', 'piano-block' ),
		value: 'fmsawtooth',
		volumeOffset: -12,
	},
	{
		label: _x( 'FM Triangle', 'oscillator waveform', 'piano-block' ),
		value: 'fmtriangle',
		volumeOffset: -2,
	},
	{
		label: _x( 'AM Sine', 'oscillator waveform', 'piano-block' ),
		value: 'amsine',
		volumeOffset: 5,
	},
	{
		label: _x( 'AM Square', 'oscillator waveform', 'piano-block' ),
		value: 'amsquare',
		volumeOffset: -10,
	},
	{
		label: _x( 'AM Sawtooth', 'oscillator waveform', 'piano-block' ),
		value: 'amsawtooth',
		volumeOffset: -8,
	},
	{
		label: _x( 'AM Triangle', 'oscillator waveform', 'piano-block' ),
		value: 'amtriangle',
		volumeOffset: +4,
	},
	{
		label: _x( 'Pulse', 'oscillator waveform', 'piano-block' ),
		value: 'pulse',
		volumeOffset: -17,
	},
	{
		label: _x( 'PWM', 'oscillator waveform', 'piano-block' ),
		value: 'pwm',
		volumeOffset: -17,
	},
] as const;

export const ENVELOPE_CONTROLS = [
	{
		label: _x( 'Attack', 'sound shape setting', 'piano-block' ),
		parameter: 'attack',
		max: 1,
	},
	{
		label: _x( 'Decay', 'sound shape setting', 'piano-block' ),
		parameter: 'decay',
		max: 2,
	},
	{
		label: _x( 'Sustain', 'sound shape setting', 'piano-block' ),
		parameter: 'sustain',
		max: 1,
	},
	{
		label: _x( 'Release', 'sound shape setting', 'piano-block' ),
		parameter: 'release',
		max: 3,
	},
] as const;

export const KEY_INDICATORS = [
	{
		label: __( 'Keyboard key', 'piano-block' ),
		value: 'key',
	},
	{
		label: _x( 'SPN', 'Scientific pitch notation', 'piano-block' ),
		value: 'spn',
	},
	{
		label: _x( 'None', 'key indicator', 'piano-block' ),
		value: '',
	},
] as const;

export type EnvelopeControl = ( typeof ENVELOPE_CONTROLS )[ number ];
export type Key = {
	note: string;
	octave: number;
	name: string[];
};

/**
 * External dependencies
 */
import type * as Tone from 'tone';
import type { KeyboardEvent } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { DEFAULT_ENVELOPE, INSTRUMENTS } from '../../constants';
import { KEYBOARD_LAYOUTS } from '../../keyboard-layout';
import Loading from '../loading';
import Keyboard from '../keyboard';
import Controls from '../controls';
import { getNormalizedVolume, getSamplerFileNames } from '../../utils';
import type { BlockAttributes, Key } from '../../constants';

type Props = {
	settings: BlockAttributes;
	onChange: ( newSettings: Partial< BlockAttributes > ) => void;
};

const Piano = ( { settings, onChange }: Props ) => {
	const { assetsUrl } = window.pianoBlockVars;
	const {
		volume,
		useSustainPedal,
		octaveOffset,
		instrument,
		synthesizerSetting,
		keyLayout,
		keyIndicator,
	} = settings;
	const [ piano, setPiano ] = useState< Tone.Sampler | Tone.PolySynth >();
	const [ isStarted, setIsStarted ] = useState( false );
	const [ isReady, setIsReady ] = useState( false );
	const [ activeKeys, setActiveKeys ] = useState< Key[] >( [] );
	const [ instrumentOctaveOffset, setInstrumentOctaveOffset ] = useState( 0 );

	const ref = useRef< HTMLDivElement >( null );
	const toneRef = useRef< Pick< typeof import( 'tone' ), 'Sampler' | 'PolySynth' > >();

	const keys: Key[] =
		KEYBOARD_LAYOUTS.find( ( { value } ) => value === keyLayout )?.keys ||
		KEYBOARD_LAYOUTS[ 0 ].keys;

	// Create the Tone.js player. Defer until the first user gesture so the
	// AudioContext is not created on page load.
	useEffect( () => {
		if ( ! isStarted || ! toneRef.current ) {
			return;
		}
		const { Sampler, PolySynth } = toneRef.current;

		const instrumentSetting = INSTRUMENTS.find( ( { value } ) => value === instrument );
		if ( ! instrumentSetting ) {
			return;
		}

		setActiveKeys( [] );
		setIsReady( false );

		let tonePlayer: Tone.Sampler | Tone.PolySynth;

		if ( instrumentSetting.value === 'synthesizer' ) {
			tonePlayer = new PolySynth().toDestination();
			tonePlayer.set( {
				...synthesizerSetting,
				envelope: synthesizerSetting.envelope || DEFAULT_ENVELOPE,
			} );
			setInstrumentOctaveOffset( 0 );
			setIsReady( true );
		} else {
			tonePlayer = new Sampler( {
				urls: getSamplerFileNames( [ ...instrumentSetting.notes ] ),
				release: 1,
				baseUrl: `${ assetsUrl }/instruments/${ instrument }/`,
				onload: () => {
					if ( ref.current ) {
						setInstrumentOctaveOffset( instrumentSetting.octaveOffset || 0 );
						setIsReady( true );
					}
				},
			} ).toDestination();
		}

		tonePlayer.volume.value = getNormalizedVolume( volume, settings );
		setPiano( tonePlayer );

		return () => {
			if ( tonePlayer ) {
				tonePlayer.dispose();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ instrument, isStarted ] );

	// Normalize the volume.
	useEffect( () => {
		if ( piano ) {
			// Equivalent to assigning `piano.volume.value`, which the React Compiler
			// rules reject as a mutation of the state.
			const now = piano.now();
			piano.volume
				.cancelScheduledValues( now )
				.setValueAtTime( getNormalizedVolume( volume, settings ), now );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ volume, settings.synthesizerSetting ] );

	// Apply synthesizer setting.
	useEffect( () => {
		if ( piano && instrument === 'synthesizer' ) {
			piano.set( {
				...synthesizerSetting,
				envelope: synthesizerSetting.envelope || DEFAULT_ENVELOPE,
			} );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ synthesizerSetting ] );

	// Release all sounds.
	useEffect( () => {
		if ( piano ) {
			piano.releaseAll();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ settings.octaveOffset, settings.useSustainPedal, settings.synthesizerSetting ] );

	// Load Tone.js and create the AudioContext on the first user gesture, then
	// let the effect build the player.
	const startTone = async (): Promise< void > => {
		const { Sampler, PolySynth, start } = await import( /* webpackPrefetch: true */ 'tone' );
		toneRef.current = { Sampler, PolySynth };
		await start();
		setIsStarted( true );
	};

	// Trigger the note corresponding to the pressed key.
	const onKeyDown = async ( event: KeyboardEvent ): Promise< void > => {
		// The first key press only unlocks audio.
		if ( ! isStarted ) {
			await startTone();
			return;
		}

		if ( ! isReady || ! piano ) {
			return;
		}

		// Find the pressed key.
		const targetKey = keys.find( ( key ) => key.name.some( ( name ) => event.key === name ) );
		if ( ! targetKey ) {
			return;
		}

		// Do nothing if the key has already been pressed.
		const isKeyPressed = activeKeys.some(
			( { note, octave } ) => targetKey.note === note && targetKey.octave === octave
		);
		if ( isKeyPressed ) {
			return;
		}

		// Trigger the note.
		const targetNote = `${ targetKey.note }${
			targetKey.octave + octaveOffset + instrumentOctaveOffset
		}`;

		piano.triggerAttack( targetNote, piano.context.currentTime );
		setActiveKeys( ( currentKeys ) => [ ...currentKeys, targetKey ] );
	};

	// Stop the note when the key is released.
	const onKeyUp = ( event: KeyboardEvent ) => {
		if ( ! isReady || ! piano ) {
			return;
		}

		const targetKey = keys.find( ( key ) => key.name.some( ( name ) => event.key === name ) );

		if ( ! targetKey ) {
			return;
		}

		// Stop the note.
		if ( ! useSustainPedal || instrument === 'synthesizer' ) {
			const targetNote = `${ targetKey.note }${
				targetKey.octave + octaveOffset + instrumentOctaveOffset
			}`;
			piano.triggerRelease( targetNote );
		}

		setActiveKeys( ( currentKeys ) =>
			currentKeys.filter(
				( { note, octave } ) => ! ( targetKey.note === note && targetKey.octave === octave )
			)
		);
	};

	// Trigger the note when the key is clicked with the mouse or the Enter key is pressed.
	const onKeyClick = async ( note: string, octave: number ) => {
		// The first click only unlocks audio.
		if ( ! isStarted ) {
			await startTone();
			return;
		}

		if ( ! isReady || ! piano ) {
			return;
		}

		// Trigger the note.
		const targetNote = `${ note }${ octave + octaveOffset + instrumentOctaveOffset }`;

		if ( useSustainPedal && instrument !== 'synthesizer' ) {
			piano.triggerAttack( targetNote, piano.context.currentTime );
		} else {
			piano.triggerAttackRelease( targetNote, 0.2 );
		}
	};

	const controlsProps = {
		settings,
		onChange,
	};

	const keyboardProps = {
		activeKeys,
		keys,
		keyIndicator,
		onKeyClick,
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="piano-block-container"
			ref={ ref }
			tabIndex={ 0 }
			onKeyDown={ onKeyDown }
			onKeyUp={ onKeyUp }
			aria-label={ __( 'Piano: Press keys to play', 'piano-block' ) }
		>
			{ isStarted && ! isReady && <Loading /> }
			<Controls { ...controlsProps } />
			<Keyboard { ...keyboardProps } />
		</div>
	);
};

export default Piano;

/**
 * External dependencies
 */
import * as Tone from 'tone';
import { KeyboardEvent } from 'react';

/**
 * WordPress dependencies
 */
import { useEffect, useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { DEFAULT_ENVELOPE, INSTRUMENTS } from '../../constants';
import { KEYBOARD_LAYOUTS } from '../../keyboard-layout';
import Loading from '../loading';
import Keyboard from '../keyboard';
import Controls from '../controls';
import { getNormalizedVolume, getSamplerUrls } from '../../utils';
import type { BlockAttributes, Key } from '../../constants';

type Props = {
	settings: BlockAttributes;
	onChange: ( {}: Partial< BlockAttributes > ) => void;
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
	const [ isReady, setIsReady ] = useState< boolean >( false );
	const [ activeKeys, setActiveKeys ] = useState< Key[] >( [] );
	const [ instrumentOctaveOffset, setInstrumentOctaveOffset ] = useState< number >( 0 );

	const ref = useRef< HTMLDivElement >( null );

	const keys: Key[] =
		KEYBOARD_LAYOUTS.find( ( { value } ) => value === keyLayout )?.keys ||
		KEYBOARD_LAYOUTS[ 0 ].keys;

	// Create Tone.js Player.
	useEffect( () => {
		const instrumentSetting = INSTRUMENTS.find( ( { value } ) => value === instrument );
		if ( ! instrumentSetting ) {
			return;
		}

		if ( piano ) {
			piano.dispose();
		}

		setActiveKeys( [] );
		setIsReady( false );

		let tonePlayer: Tone.Sampler | Tone.PolySynth;

		if ( instrumentSetting.value === 'synthesizer' ) {
			tonePlayer = new Tone.PolySynth().toDestination();
			tonePlayer.set( {
				...synthesizerSetting,
				envelope: synthesizerSetting.envelope || DEFAULT_ENVELOPE,
			} );
			setInstrumentOctaveOffset( 0 );
			setIsReady( true );
		} else {
			tonePlayer = new Tone.Sampler( {
				urls: getSamplerUrls( instrumentSetting ),
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
	}, [ instrument ] );

	// Normalize Volume.
	useEffect( () => {
		if ( piano ) {
			piano.volume.value = getNormalizedVolume( volume, settings );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ volume, settings.synthesizerSetting ] );

	// Release all sounds.
	useEffect( () => {
		if ( piano ) {
			piano.releaseAll();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ settings.octaveOffset, settings.useSustainPedal, settings.synthesizerSetting ] );

	// Trigger the note corresponding to the pressed key.
	const onKeyDown = ( event: KeyboardEvent ): void => {
		if ( ! isReady || ! piano ) {
			return;
		}

		// Search the pressed key.
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

		piano.triggerAttack( targetNote );
		setActiveKeys( [ ...activeKeys, targetKey ] );
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

		const newActiveKeys = activeKeys.filter(
			( { note, octave } ) => ! ( targetKey.note === note && targetKey.octave === octave )
		);
		setActiveKeys( newActiveKeys );
	};

	// Trigger the note when the key is clicked by the mouse cursor or when the enter key is pressed.
	const onKeyClick = ( note: string, octave: number ) => {
		if ( ! isReady || ! piano ) {
			return;
		}

		// Trigger the note.
		const targetNote = `${ note }${ octave + octaveOffset + instrumentOctaveOffset }`;

		if ( useSustainPedal && instrument !== 'synthesizer' ) {
			piano.triggerAttack( targetNote );
		} else {
			piano.triggerAttackRelease( targetNote, 0.2 );
		}
	};

	const controlsProps = {
		settings,
		piano,
		onChange: ( newSettings: Partial< BlockAttributes > ) => {
			onChange( {
				...settings,
				...newSettings,
			} );
		},
	};

	const keyboardProps = {
		activeKeys,
		keyLayout,
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
		>
			{ ! isReady && <Loading /> }
			<Controls { ...controlsProps } />
			<Keyboard { ...keyboardProps } />
		</div>
	);
};

export default Piano;

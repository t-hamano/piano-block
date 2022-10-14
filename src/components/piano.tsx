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
import { INSTRUMENTS, KEYS } from '../constants';
import { Loading, Keyboard, Controls } from '../components';
import { getSamplerUrls } from '../utils';
import type { BlockAttributes, Key } from '../constants';

type Props = {
	settings: BlockAttributes;
	onChange: ( {}: Partial< BlockAttributes > ) => void;
};

const Piano = ( { settings, onChange }: Props ) => {
	const { assetsUrl } = window.pianoBlockVars;
	const { volume, useSustainPedal, octaveOffset, instrument } = settings;
	const [ piano, setPiano ] = useState< Tone.Sampler >();
	const [ isReady, setIsReady ] = useState< boolean >( false );
	const [ activeKeys, setActiveKeys ] = useState< Key[] >( [] );
	const [ instrumentOctaveOffset, setInstrumentOctaveOffset ] = useState< number >( 0 );

	const ref = useRef< HTMLDivElement >( null );

	useEffect( () => {
		// Initial processing of Tone.js Sampler.
		const currentInstrument = INSTRUMENTS.find( ( { value } ) => value === instrument );
		if ( ! currentInstrument ) return;

		const urls = getSamplerUrls( currentInstrument );

		const tonePlayer = new Tone.Sampler( {
			urls,
			release: 1,
			baseUrl: `${ assetsUrl }/instruments/${ instrument }/`,
			onload: () => {
				if ( ref.current ) {
					setInstrumentOctaveOffset( currentInstrument.octaveOffset );
					setIsReady( true );
				}
			},
		} ).toDestination();

		tonePlayer.volume.value = volume;
		setPiano( tonePlayer );

		return () => {
			if ( tonePlayer ) {
				tonePlayer.dispose();
			}
		};
	}, [] );

	// Focus on the block itself to prevent manipulation of the form elements in the block when the key is pressed.
	useEffect( () => {
		if ( ref.current ) {
			ref.current.focus();
		}
	}, [ activeKeys ] );

	// Release all sounds.
	useEffect( () => {
		if ( ! piano ) return;
		piano.releaseAll();
	}, [ settings.useSustainPedal ] );

	// Play the audio corresponding to the pressed key.
	const onKeyDown = ( event: KeyboardEvent ): void => {
		if ( ! isReady || ! piano ) return;

		const targetKey: Key | undefined = KEYS.find( ( key ) =>
			key.name.some( ( name ) => event.key === name )
		);
		if ( ! targetKey ) return;

		// Do nothing if the key has already been pressed.
		const isKeyPressed = activeKeys.some(
			( { note, octave } ) => targetKey.note === note && targetKey.octave === octave
		);
		if ( isKeyPressed ) return;

		const targetNote = `${ targetKey.note }${
			targetKey.octave + octaveOffset + instrumentOctaveOffset
		}`;

		piano.triggerAttack( targetNote );

		setActiveKeys( [ ...activeKeys, targetKey ] );
	};

	// Release audio when a key is released.
	const onKeyUp = ( event: KeyboardEvent ) => {
		if ( ! isReady || ! piano ) return;

		const targetKey = KEYS.find( ( key ) => key.name.some( ( name ) => event.key === name ) );

		if ( ! targetKey ) return;

		if ( ! useSustainPedal ) {
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

	// Mouse cursor is clicked or the Enter key is pressed on the keyboard.
	const onKeyClick = ( note: string, octave: number ) => {
		if ( ! isReady || ! piano ) return;

		const targetNote = `${ note }${ octave + octaveOffset + instrumentOctaveOffset }`;

		if ( useSustainPedal ) {
			piano.triggerAttack( targetNote );
		} else {
			piano.triggerAttackRelease( targetNote, 0.2 );
		}
	};

	const controlsProps = {
		settings,
		piano,
		setPiano,
		setActiveKeys,
		setIsReady,
		setInstrumentOctaveOffset,
	};

	const keyboardProps = {
		activeKeys,
		onKeyClick,
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="piano-block-container"
			onKeyDown={ onKeyDown }
			onKeyUp={ onKeyUp }
			tabIndex={ 0 }
			ref={ ref }
		>
			{ ! isReady && <Loading /> }
			<Controls
				{ ...controlsProps }
				onChange={ ( newSettings ) => {
					onChange( {
						...settings,
						...newSettings,
					} );
				} }
			/>
			<Keyboard { ...keyboardProps } />
		</div>
	);
};

export default Piano;

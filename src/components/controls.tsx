/**
 * External dependencies
 */
import * as Tone from 'tone';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ButtonGroup,
	Button,
	BaseControl,
	SelectControl,
	RangeControl,
	ToggleControl,
	Modal,
	Popover,
} from '@wordpress/components';
import { cog, help } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { INSTRUMENTS, OCTAVE_OFFSETS, MIN_VOLUME, MAX_VOLUME } from '../constants';
import { SynthesizerSetting } from '../components';
import { getNormalizedVolume } from '../utils';
import type { BlockAttributes } from '../constants';

type Props = {
	settings: BlockAttributes;
	piano: Tone.Sampler | Tone.PolySynth | undefined;
	onChange: ( {}: Partial< BlockAttributes > ) => void;
};

const Controls = ( { settings, piano, onChange }: Props ) => {
	const { volume, useSustainPedal, octaveOffset, instrument, synthesizerSetting } = settings;
	const [ isHelpOpen, setIsHelpOpen ] = useState< boolean >( false );
	const [ isSynthesizerSettingOpen, setIsSynthesizerSettingOpen ] = useState< boolean >( false );

	const onVolumeChange = ( newVolume: number | undefined ) => {
		const instrumentSetting = INSTRUMENTS.find( ( { value } ) => value === instrument );
		if ( ! piano || ! instrumentSetting ) {
			return;
		}

		piano.volume.value = getNormalizedVolume( newVolume, settings );
		onChange( { volume: newVolume } );
	};

	const onOctaveOffsetChange = ( newOctaveOffset: number ) => {
		onChange( { octaveOffset: newOctaveOffset } );
	};

	const onInstrumentChange = ( newInstrument: typeof INSTRUMENTS[ number ][ 'value' ] ) => {
		setIsSynthesizerSettingOpen( false );
		onChange( { instrument: newInstrument } );
	};

	const onUseSustainPedalChange = () => {
		onChange( { useSustainPedal: ! useSustainPedal } );
	};

	const onSynthesizerSettingChange = (
		newSynthesizerSetting: BlockAttributes[ 'synthesizerSetting' ]
	) => {
		if ( ! piano || instrument !== 'synthesizer' ) {
			return;
		}

		piano.set( newSynthesizerSetting );
		piano.releaseAll();

		onChange( { synthesizerSetting: newSynthesizerSetting } );
	};

	return (
		<div className="piano-block-controls">
			<div className="piano-block-controls__control piano-block-controls__control--volume">
				<RangeControl
					label={ __( 'Volume', 'piano-block' ) }
					value={ volume || 0 }
					min={ MIN_VOLUME }
					max={ MAX_VOLUME }
					step={ 0.1 }
					allowReset
					// @ts-ignore: `withInputField` prop is not exist at @types
					withInputField={ false }
					onChange={ onVolumeChange }
				/>
			</div>
			<div className="piano-block-controls__control">
				<BaseControl id="piano-block-control-octave" label={ __( 'Octave Offset', 'piano-block' ) }>
					<ButtonGroup>
						{ OCTAVE_OFFSETS.map( ( { label, value }, index ) => (
							<Button
								key={ index }
								variant={ value === octaveOffset ? 'primary' : undefined }
								onClick={ () => onOctaveOffsetChange( value ) }
							>
								{ label }
							</Button>
						) ) }
					</ButtonGroup>
				</BaseControl>
			</div>
			<div className="piano-block-controls__control piano-block-controls__control--instrument">
				<SelectControl
					label={ __( 'Insturment', 'piano-block' ) }
					value={ instrument }
					options={ INSTRUMENTS.map( ( { label, value } ) => {
						return { label, value };
					} ) }
					onChange={ onInstrumentChange }
				/>
				{ instrument === 'synthesizer' && (
					<>
						<Button
							label={ __( 'Synthesizer Setting', 'piano-block' ) }
							icon={ cog }
							variant="primary"
							onClick={ () => setIsSynthesizerSettingOpen( ! isSynthesizerSettingOpen ) }
						/>
						{ isSynthesizerSettingOpen && (
							<Popover
								// @ts-ignore: `withInputField` prop is not exist at @types
								placement="top"
							>
								<SynthesizerSetting
									synthesizerSetting={ synthesizerSetting }
									onChange={ onSynthesizerSettingChange }
								/>
							</Popover>
						) }
					</>
				) }
			</div>
			<div className="piano-block-controls__control">
				<ToggleControl
					label={ __( 'Use Sustain Pedal', 'piano-block' ) }
					checked={ useSustainPedal }
					onChange={ onUseSustainPedalChange }
					// @ts-ignore: `disabled` prop is not exist at @types
					disabled={ instrument === 'synthesizer' }
				/>
			</div>
			<Button
				className="piano-block-help"
				label={ __( 'Help', 'piano-block' ) }
				icon={ help }
				onClick={ () => setIsHelpOpen( true ) }
			/>
			{ isHelpOpen && (
				<Modal
					title={ __( 'About Piano Block', 'piano-block' ) }
					className="piano-block-help-modal"
					onRequestClose={ () => setIsHelpOpen( false ) }
				>
					<div className="piano-block-help-modal__content">
						<ul>
							<li>
								{ __( 'You can play a variety of tones using the keyboard.', 'piano-block' ) }
							</li>
							<li>
								{ __(
									'Clicking on the keyboard with the mouse or typing the keys indicated on the keyboard will play audio.',
									'piano-block'
								) }
							</li>
							<li>
								{ __(
									'Due to conflicts with OS or browser shortcuts, some audio may not play depending on the combination of keys you are pressing.',
									'piano-block'
								) }
							</li>
						</ul>
					</div>
				</Modal>
			) }
		</div>
	);
};

export default Controls;

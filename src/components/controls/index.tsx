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
	Popover,
} from '@wordpress/components';
import { cog, help } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	INSTRUMENTS,
	DEFAULT_ENVELOPE,
	OCTAVE_OFFSETS,
	MIN_VOLUME,
	MAX_VOLUME,
} from '../../constants';
import SynthesizerSetting from '../synthesizer-setting';
import HelpModal from '../help-modal';
import { getNormalizedVolume } from '../../utils';
import type { BlockAttributes } from '../../constants';

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

	const onInstrumentChange = ( newInstrument: ( typeof INSTRUMENTS )[ number ][ 'value' ] ) => {
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

		piano.set( {
			...newSynthesizerSetting,
			envelope: newSynthesizerSetting.envelope || DEFAULT_ENVELOPE,
		} );
		onChange( { synthesizerSetting: newSynthesizerSetting } );
	};

	return (
		<div className="piano-block-controls">
			<RangeControl
				className="piano-block-controls__control"
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
			<BaseControl
				className="piano-block-controls__control"
				id="piano-block-control-octave"
				label={ __( 'Octave Offset', 'piano-block' ) }
			>
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
			<SelectControl
				className="piano-block-controls__control"
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
						className="piano-block-controls__synthesizer-toggle"
						label={ __( 'Synthesizer Setting', 'piano-block' ) }
						icon={ cog }
						variant="primary"
						onClick={ () => setIsSynthesizerSettingOpen( ! isSynthesizerSettingOpen ) }
					/>
					{ isSynthesizerSettingOpen && (
						<Popover
							// @ts-ignore: `withInputField` prop is not exist at @types
							placement="top"
							onClose={ () => setIsSynthesizerSettingOpen( false ) }
						>
							<SynthesizerSetting
								synthesizerSetting={ synthesizerSetting }
								onChange={ onSynthesizerSettingChange }
							/>
						</Popover>
					) }
				</>
			) }
			<ToggleControl
				className="piano-block-controls__control"
				label={ __( 'Use Sustain Pedal', 'piano-block' ) }
				checked={ useSustainPedal }
				onChange={ onUseSustainPedalChange }
				// @ts-ignore: `disabled` prop is not exist at @types
				disabled={ instrument === 'synthesizer' }
			/>
			<Button
				className="piano-block-help"
				label={ __( 'Help', 'piano-block' ) }
				icon={ help }
				onClick={ () => setIsHelpOpen( true ) }
			/>
			{ isHelpOpen && <HelpModal onClose={ () => setIsHelpOpen( false ) } /> }
		</div>
	);
};

export default Controls;
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
	KEY_INDICATORS,
	MIN_VOLUME,
	MAX_VOLUME,
} from '../../constants';
import { KEYBOARD_LAYOUTS } from '../../keyboard-layout';
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
	const {
		volume,
		useSustainPedal,
		octaveOffset,
		instrument,
		synthesizerSetting,
		keyLayout,
		keyIndicator,
	} = settings;
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

	const onInstrumentChange = ( newInstrument: string ) => {
		const allowedInstrument = INSTRUMENTS.find( ( { value } ) => value === newInstrument );
		if ( ! allowedInstrument ) {
			return;
		}
		onChange( { instrument: allowedInstrument.value } );
	};

	const onUseSustainPedalChange = () => {
		onChange( { useSustainPedal: ! useSustainPedal } );
	};

	const onKeyLayoutChange = ( newKeyLayout: string ) => {
		onChange( { keyLayout: newKeyLayout } );
	};

	const onKeyIndicatorChange = ( newKeyIndicator: string ) => {
		onChange( { keyIndicator: newKeyIndicator } );
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
				__nextHasNoMarginBottom
				label={ __( 'Volume', 'piano-block' ) }
				value={ volume || 0 }
				min={ MIN_VOLUME }
				max={ MAX_VOLUME }
				step={ 0.1 }
				allowReset
				withInputField={ false }
				onChange={ onVolumeChange }
			/>
			<BaseControl
				__nextHasNoMarginBottom
				id="piano-block-control-octave"
				label={ __( 'Octave Offset', 'piano-block' ) }
			>
				<ButtonGroup>
					{ OCTAVE_OFFSETS.map( ( { label, value }, index ) => (
						<Button
							key={ index }
							variant={ value === octaveOffset ? 'primary' : undefined }
							onClick={ () => onOctaveOffsetChange( value ) }
							size="compact"
						>
							{ label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
			<SelectControl
				__nextHasNoMarginBottom
				label={ __( 'Instrument', 'piano-block' ) }
				value={ instrument }
				options={ INSTRUMENTS.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onInstrumentChange }
			/>
			{ instrument === 'synthesizer' && (
				<div className="piano-block-controls__synthesizer-toggle">
					<Button
						label={ __( 'Synthesizer Setting', 'piano-block' ) }
						icon={ cog }
						variant="primary"
						onClick={ () => setIsSynthesizerSettingOpen( ! isSynthesizerSettingOpen ) }
						size="compact"
					/>
					{ isSynthesizerSettingOpen && (
						<Popover placement="top" onClose={ () => setIsSynthesizerSettingOpen( false ) }>
							<SynthesizerSetting
								synthesizerSetting={ synthesizerSetting }
								onChange={ onSynthesizerSettingChange }
							/>
						</Popover>
					) }
				</div>
			) }
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Sustain Pedal', 'piano-block' ) }
				checked={ useSustainPedal }
				onChange={ onUseSustainPedalChange }
				disabled={ instrument === 'synthesizer' }
			/>
			<SelectControl
				__nextHasNoMarginBottom
				label={ __( 'Key Layout', 'piano-block' ) }
				value={ keyLayout }
				options={ KEYBOARD_LAYOUTS.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onKeyLayoutChange }
				size="compact"
			/>
			<SelectControl
				__nextHasNoMarginBottom
				label={ __( 'Key Indicator', 'piano-block' ) }
				value={ keyIndicator }
				options={ KEY_INDICATORS.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onKeyIndicatorChange }
				size="compact"
			/>
			<Button
				className="piano-block-controls__help"
				label={ __( 'Help', 'piano-block' ) }
				icon={ help }
				onClick={ () => setIsHelpOpen( true ) }
				size="small"
			/>
			{ isHelpOpen && <HelpModal onClose={ () => setIsHelpOpen( false ) } /> }
		</div>
	);
};

export default Controls;

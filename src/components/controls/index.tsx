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
							// @ts-ignore: `size` prop is not exist at @types
							size="compact"
						>
							{ label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
			<SelectControl
				className="piano-block-controls__control"
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
						// @ts-ignore: `size` prop is not exist at @types
						size="compact"
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
				</div>
			) }
			<ToggleControl
				className="piano-block-controls__control"
				label={ __( 'Sustain Pedal', 'piano-block' ) }
				checked={ useSustainPedal }
				onChange={ onUseSustainPedalChange }
				// @ts-ignore: `disabled` prop is not exist at @types
				disabled={ instrument === 'synthesizer' }
			/>
			<SelectControl
				className="piano-block-controls__control"
				label={ __( 'Key Layout', 'piano-block' ) }
				value={ keyLayout }
				options={ KEYBOARD_LAYOUTS.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onKeyLayoutChange }
				// @ts-ignore: `size` prop is not exist at @types
				size="compact"
			/>
			<SelectControl
				className="piano-block-controls__control"
				label={ __( 'Key Indicator', 'piano-block' ) }
				value={ keyIndicator }
				options={ KEY_INDICATORS.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onKeyIndicatorChange }
				// @ts-ignore: `size` prop is not exist at @types
				size="compact"
			/>
			<Button
				className="piano-block-controls__help"
				label={ __( 'Help', 'piano-block' ) }
				icon={ help }
				onClick={ () => setIsHelpOpen( true ) }
				// @ts-ignore: `size` prop is not exist at @types
				size="compact"
			/>
			{ isHelpOpen && <HelpModal onClose={ () => setIsHelpOpen( false ) } /> }
		</div>
	);
};

export default Controls;

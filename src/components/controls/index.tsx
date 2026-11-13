/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Popover } from '@wordpress/components';
import { Stack } from '@wordpress/ui';
import { Icon, help, settings as settingsIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	INSTRUMENTS,
	KEY_INDICATORS,
	MIN_VOLUME,
	MAX_VOLUME,
	MIN_OCTAVE_OFFSET,
	MAX_OCTAVE_OFFSET,
} from '../../constants';
import { KEYBOARD_LAYOUTS } from '../../keyboard-layout';
import IconButton from '../icon-button';
import Knob from '../knob';
import Select from '../select';
import Stepper from '../stepper';
import SynthesizerSetting from '../synthesizer-setting';
import HelpModal from '../help-modal';
import type { BlockAttributes } from '../../constants';

const sustainPedalIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		{ [ 6, 12, 18 ].map( ( y ) =>
			[ 6, 12, 18 ].map( ( x ) => <circle key={ `${ x }-${ y }` } cx={ x } cy={ y } r="1.75" /> )
		) }
	</svg>
);

type Props = {
	settings: BlockAttributes;
	onChange: ( newAttributes: Partial< BlockAttributes > ) => void;
	onKeyDown: ( event: KeyboardEvent ) => void;
	onKeyUp: ( event: KeyboardEvent ) => void;
};

const Controls = ( { settings, onChange, onKeyDown, onKeyUp }: Props ) => {
	const {
		volume,
		useSustainPedal,
		octaveOffset,
		instrument,
		synthesizerSetting,
		keyLayout,
		keyIndicator,
	} = settings;
	const [ isHelpOpen, setIsHelpOpen ] = useState( false );
	const [ isSynthesizerSettingOpen, setIsSynthesizerSettingOpen ] = useState( false );

	const onVolumeChange = ( newVolume: number ) => {
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
		const allowedKeyIndicator = KEY_INDICATORS.find( ( { value } ) => value === newKeyIndicator );
		if ( ! allowedKeyIndicator ) {
			return;
		}
		onChange( { keyIndicator: allowedKeyIndicator.value } );
	};

	const onSynthesizerSettingChange = (
		newSynthesizerSetting: BlockAttributes[ 'synthesizerSetting' ]
	) => {
		if ( instrument !== 'synthesizer' ) {
			return;
		}

		onChange( { synthesizerSetting: newSynthesizerSetting } );
	};

	return (
		<Stack className="piano-block-controls" direction="row" wrap="wrap" gap="md" align="flex-start">
			<Knob
				label={ __( 'Volume', 'piano-block' ) }
				value={ volume || 0 }
				min={ MIN_VOLUME }
				max={ MAX_VOLUME }
				step={ 0.1 }
				onChange={ onVolumeChange }
			/>
			<Stepper
				label={ __( 'Octave', 'piano-block' ) }
				value={ octaveOffset }
				min={ MIN_OCTAVE_OFFSET }
				max={ MAX_OCTAVE_OFFSET }
				onChange={ onOctaveOffsetChange }
			/>
			<div className="piano-block-controls__instrument">
				<Select
					label={ __( 'Instrument', 'piano-block' ) }
					value={ instrument }
					options={ INSTRUMENTS }
					onChange={ onInstrumentChange }
				/>
				{ instrument === 'synthesizer' && (
					// The popover is anchored to its parent element.
					<div>
						<IconButton
							label={ __( 'Synthesizer Settings', 'piano-block' ) }
							icon={ settingsIcon }
							onClick={ () => setIsSynthesizerSettingOpen( ! isSynthesizerSettingOpen ) }
							aria-haspopup="true"
							aria-expanded={ isSynthesizerSettingOpen }
						/>
						{ isSynthesizerSettingOpen && (
							<Popover
								placement="top"
								offset={ 8 }
								onClose={ () => setIsSynthesizerSettingOpen( false ) }
								// The popover is rendered in a portal, so its key events never reach
								// the listeners on the block wrapper. Play the piano from here instead.
								onKeyDown={ ( event ) => onKeyDown( event.nativeEvent ) }
								onKeyUp={ ( event ) => onKeyUp( event.nativeEvent ) }
							>
								<SynthesizerSetting
									synthesizerSetting={ synthesizerSetting }
									onChange={ onSynthesizerSettingChange }
								/>
							</Popover>
						) }
					</div>
				) }
			</div>
			<Select
				label={ __( 'Key Layout', 'piano-block' ) }
				value={ keyLayout }
				options={ KEYBOARD_LAYOUTS }
				onChange={ onKeyLayoutChange }
			/>
			<Select
				label={ _x( 'Key Label', 'text shown on piano keys', 'piano-block' ) }
				value={ keyIndicator }
				options={ KEY_INDICATORS }
				onChange={ onKeyIndicatorChange }
			/>
			<div className="piano-block-controls__sustain-pedal">
				<span className="piano-block-controls__sustain-pedal-label" aria-hidden="true">
					{ _x( 'Sustain', 'sustain pedal', 'piano-block' ) }
				</span>
				<IconButton
					label={ _x( 'Sustain', 'sustain pedal', 'piano-block' ) }
					icon={ sustainPedalIcon }
					onClick={ onUseSustainPedalChange }
					aria-pressed={ useSustainPedal }
					disabled={ instrument === 'synthesizer' }
				/>
			</div>
			<button
				type="button"
				className="piano-block-controls__help"
				aria-label={ __( 'Help', 'piano-block' ) }
				onClick={ () => setIsHelpOpen( true ) }
				aria-haspopup="dialog"
				aria-expanded={ isHelpOpen }
			>
				<Icon icon={ help } size={ 20 } />
			</button>
			{ isHelpOpen && <HelpModal onClose={ () => setIsHelpOpen( false ) } /> }
		</Stack>
	);
};

export default Controls;

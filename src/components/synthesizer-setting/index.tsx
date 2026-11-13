/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	DEFAULT_OSCILLATOR_TYPE,
	DEFAULT_ENVELOPE,
	ENVELOPE_CONTROLS,
	OSCILLATOR_TYPES,
} from '../../constants';
import Knob from '../knob';
import Select from '../select';
import type { BlockAttributes, EnvelopeControl } from '../../constants';

type Props = {
	synthesizerSetting: BlockAttributes[ 'synthesizerSetting' ];
	onChange: ( newSynthesizerSetting: BlockAttributes[ 'synthesizerSetting' ] ) => void;
};

const SynthesizerSetting = ( { synthesizerSetting, onChange }: Props ) => {
	const { oscillator, envelope = DEFAULT_ENVELOPE } = synthesizerSetting;

	const onOscillatorTypeChange = ( newOscillatorType: string ) => {
		const allowedOscillatorType = OSCILLATOR_TYPES.find(
			( { value } ) => value === newOscillatorType
		);

		if ( ! allowedOscillatorType ) {
			return;
		}

		onChange( {
			...synthesizerSetting,
			oscillator: {
				...synthesizerSetting.oscillator,
				type: allowedOscillatorType.value,
			},
		} );
	};

	const onEnvelopeChange = ( parameter: EnvelopeControl[ 'parameter' ], value: number ) => {
		onChange( {
			...synthesizerSetting,
			envelope: {
				...DEFAULT_ENVELOPE,
				...synthesizerSetting.envelope,
				[ parameter ]: value,
			},
		} );
	};

	return (
		<>
			<Select
				label={ __( 'Oscillator Type', 'piano-block' ) }
				value={ oscillator?.type || DEFAULT_OSCILLATOR_TYPE }
				options={ OSCILLATOR_TYPES }
				onChange={ onOscillatorTypeChange }
			/>
			<div className="piano-block-synthesizer-setting__envelope">
				{ ENVELOPE_CONTROLS.map( ( { label, parameter, max } ) => (
					<Knob
						key={ parameter }
						label={ label }
						value={ envelope[ parameter ] ?? DEFAULT_ENVELOPE[ parameter ] }
						min={ 0.05 }
						max={ max }
						step={ 0.05 }
						onChange={ ( value ) => onEnvelopeChange( parameter, value ) }
					/>
				) ) }
			</div>
		</>
	);
};

export default SynthesizerSetting;

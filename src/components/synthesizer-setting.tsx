/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DEFAULT_OSCILLATOR_TYPE, OSCILLATOR_TYPES } from '../constants';
import type { BlockAttributes, OscillatorType } from '../constants';

type Props = {
	synthesizerSetting: BlockAttributes[ 'synthesizerSetting' ];
	onChange: ( {}: BlockAttributes[ 'synthesizerSetting' ] ) => void;
};

const SynthesizerSetting = ( { synthesizerSetting, onChange }: Props ) => {
	const { oscillator } = synthesizerSetting;

	const onOscillatorTypeChange = ( newOscillatorType: OscillatorType[ 'value' ] ) => {
		onChange( {
			...synthesizerSetting,
			oscillator: {
				...synthesizerSetting.oscillator,
				type: newOscillatorType,
			},
		} );
	};

	return (
		<div className="piano-block-synthesizer-setting">
			<h2>{ __( 'Synthesizer Setting', 'piano-block' ) }</h2>
			<SelectControl
				label={ __( 'Insturment', 'piano-block' ) }
				value={ oscillator?.type || DEFAULT_OSCILLATOR_TYPE }
				options={ OSCILLATOR_TYPES.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onOscillatorTypeChange }
			/>
		</div>
	);
};

export default SynthesizerSetting;

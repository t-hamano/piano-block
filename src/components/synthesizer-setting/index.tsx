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

const GRAPH_WIDTH = 128;
const GRAPH_HEIGHT = 48;
const GRAPH_PADDING = 6;

const getEnvelopePoints = ( { attack, decay, sustain, release }: typeof DEFAULT_ENVELOPE ) => {
	const left = GRAPH_PADDING;
	const right = GRAPH_WIDTH - GRAPH_PADDING;
	const top = GRAPH_PADDING;
	const bottom = GRAPH_HEIGHT - GRAPH_PADDING;
	const sustainWidth = ( right - left ) / 4;
	const unit = ( right - left - sustainWidth ) / ( attack + decay + release );
	const attackX = left + attack * unit;
	const decayX = attackX + decay * unit;
	const sustainY = bottom - sustain * ( bottom - top );

	return [
		[ left, bottom ],
		[ attackX, top ],
		[ decayX, sustainY ],
		[ decayX + sustainWidth, sustainY ],
		[ right, bottom ],
	];
};

type Props = {
	synthesizerSetting: BlockAttributes[ 'synthesizerSetting' ];
	onChange: ( newSynthesizerSetting: BlockAttributes[ 'synthesizerSetting' ] ) => void;
};

const SynthesizerSetting = ( { synthesizerSetting, onChange }: Props ) => {
	const { oscillator, envelope = DEFAULT_ENVELOPE } = synthesizerSetting;
	const envelopePoints = getEnvelopePoints( { ...DEFAULT_ENVELOPE, ...envelope } );

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
			<svg
				className="piano-block-synthesizer-setting__graph"
				viewBox={ `0 0 ${ GRAPH_WIDTH } ${ GRAPH_HEIGHT }` }
				aria-hidden="true"
				focusable="false"
			>
				{ ENVELOPE_CONTROLS.map( ( { parameter }, index ) => {
					const [ x1, y1 ] = envelopePoints[ index ];
					const [ x2, y2 ] = envelopePoints[ index + 1 ];
					return <line key={ parameter } x1={ x1 } y1={ y1 } x2={ x2 } y2={ y2 } />;
				} ) }
			</svg>
		</>
	);
};

export default SynthesizerSetting;

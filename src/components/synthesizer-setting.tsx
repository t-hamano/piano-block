/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { RangeControl, SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	DEFAULT_OSCILLATOR_TYPE,
	DEFAULT_ENVELOPE,
	EMVELOPE_CONTROLS,
	OSCILLATOR_TYPES,
} from '../constants';
import type { BlockAttributes, EmvelopeControl, OscillatorType } from '../constants';

type Props = {
	synthesizerSetting: BlockAttributes[ 'synthesizerSetting' ];
	onChange: ( {}: BlockAttributes[ 'synthesizerSetting' ] ) => void;
};

const SynthesizerSetting = ( { synthesizerSetting, onChange }: Props ) => {
	const { oscillator, envelope = DEFAULT_ENVELOPE } = synthesizerSetting;
	const ref = useRef< HTMLCanvasElement >( null );

	const onOscillatorTypeChange = ( newOscillatorType: OscillatorType[ 'value' ] ) => {
		onChange( {
			...synthesizerSetting,
			oscillator: {
				...synthesizerSetting.oscillator,
				type: newOscillatorType,
			},
		} );
	};

	const onEnvelopeChange = (
		parameter: EmvelopeControl[ 'parameter' ],
		value: number | undefined
	) => {
		onChange( {
			...synthesizerSetting,
			envelope: {
				...DEFAULT_ENVELOPE,
				...synthesizerSetting.envelope,
				[ parameter ]: value,
			},
		} );
	};

	// Draw ADSR graph.
	useEffect( () => {
		if ( ! ref.current ) {
			return;
		}

		const context = ref.current.getContext( '2d' );

		if ( ! context ) {
			return;
		}

		const { width, height } = ref.current;

		const { attack, decay, sustain, release } = envelope;
		const CANVAS_OFFSET = 20;
		const SUSTAIN_WIDTH = width / 4;

		const total = attack + decay + release;
		let point = CANVAS_OFFSET;

		context.clearRect( 0, 0, width, height );
		context.beginPath();

		// Attack
		context.moveTo( point, height );
		point = ( attack / total ) * ( width - SUSTAIN_WIDTH - CANVAS_OFFSET * 2 ) + CANVAS_OFFSET;
		context.lineTo( point, CANVAS_OFFSET );

		// Decay
		point += ( decay / total ) * ( width - SUSTAIN_WIDTH - CANVAS_OFFSET * 2 );
		context.lineTo( point, height - sustain * ( height - CANVAS_OFFSET ) );

		// Sustain
		context.lineTo( point + SUSTAIN_WIDTH, height - sustain * ( height - CANVAS_OFFSET ) );
		point += SUSTAIN_WIDTH;

		// Release
		context.lineTo( width - CANVAS_OFFSET, height );

		context.strokeStyle = '#1e1e1e';
		context.lineWidth = 2;

		context.stroke();
		context.closePath();
	}, [ envelope ] );

	return (
		<div className="piano-block-synthesizer-setting">
			<SelectControl
				label={ __( 'Oscillator Type', 'piano-block' ) }
				value={ oscillator?.type || DEFAULT_OSCILLATOR_TYPE }
				options={ OSCILLATOR_TYPES.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onOscillatorTypeChange }
			/>
			<div className="piano-block-synthesizer-setting__envelope">
				{ EMVELOPE_CONTROLS.map( ( { label, parameter, min, max } ) => (
					<RangeControl
						key={ parameter }
						label={ label }
						value={ envelope[ parameter ] ?? DEFAULT_ENVELOPE[ parameter ] }
						min={ min }
						max={ max }
						step={ 0.1 }
						// @ts-ignore: `withInputField` prop is not exist at @types
						withInputField={ false }
						onChange={ ( value ) => onEnvelopeChange( parameter, value ) }
					/>
				) ) }
			</div>
			<canvas ref={ ref } className="piano-block-synthesizer-setting__graph"></canvas>
		</div>
	);
};

export default SynthesizerSetting;

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import {
	Button,
	RangeControl,
	SelectControl,
	// @ts-ignore: has no exported member
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	DEFAULT_OSCILLATOR_TYPE,
	DEFAULT_ENVELOPE,
	EMVELOPE_CONTROLS,
	OSCILLATOR_TYPES,
} from '../../constants';
import type { BlockAttributes, EmvelopeControl, OscillatorType } from '../../constants';

type Props = {
	synthesizerSetting: BlockAttributes[ 'synthesizerSetting' ];
	onChange: ( {}: BlockAttributes[ 'synthesizerSetting' ] ) => void;
};

const SynthesizerSetting = ( { synthesizerSetting, onChange }: Props ) => {
	const { oscillator, envelope = DEFAULT_ENVELOPE } = synthesizerSetting;
	const ref = useRef< HTMLCanvasElement >( null );

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
		const canvasOffset = 20;
		const innerWidth = width - canvasOffset * 2;
		const sustainWidth = innerWidth / 4;
		const total = attack + decay + release;

		let point = canvasOffset;

		context.clearRect( 0, 0, width, height );
		context.beginPath();

		// Attack
		context.moveTo( point, height );
		point += ( attack / total ) * ( innerWidth - sustainWidth );
		context.lineTo( point, canvasOffset );

		// Decay
		point += ( decay / total ) * ( innerWidth - sustainWidth );
		context.lineTo( point, height - sustain * ( height - canvasOffset ) );

		// Sustain
		context.lineTo( point + sustainWidth, height - sustain * ( height - canvasOffset ) );
		point += sustainWidth;

		// Release
		context.lineTo( width - canvasOffset, height );

		context.strokeStyle = '#1e1e1e';
		context.lineWidth = 2;
		context.stroke();
		context.closePath();
	}, [ envelope ] );

	const onOscillatorTypeChange = ( newOscillatorType: OscillatorType[ 'value' ] ) => {
		onChange( {
			...synthesizerSetting,
			oscillator: {
				...synthesizerSetting.oscillator,
				type: newOscillatorType,
			},
		} );
	};

	// Disable unexpected key events on select elements.
	const onOscillatorTypeKeyDown = ( event: React.KeyboardEvent< HTMLSelectElement > ) => {
		const isAcceptableKey = [ 'ArrowUp', 'ArrowDown', 'Enter', 'Tab' ].includes( event.key );
		if ( ! isAcceptableKey ) {
			event.preventDefault();
		}
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

	const onEnvelopeReset = () => {
		const { envelope: _, ...newSynthesizerSetting } = synthesizerSetting;
		onChange( newSynthesizerSetting );
	};

	return (
		<VStack className="piano-block-synthesizer-setting">
			<SelectControl
				label={ __( 'Oscillator Type', 'piano-block' ) }
				autoComplete="off"
				value={ oscillator?.type || DEFAULT_OSCILLATOR_TYPE }
				options={ OSCILLATOR_TYPES.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onKeyDown={ onOscillatorTypeKeyDown }
				onChange={ onOscillatorTypeChange }
				// @ts-ignore: `size` prop is not exist at @types
				size="compact"
			/>
			<div className="piano-block-synthesizer-setting__envelope">
				{ EMVELOPE_CONTROLS.map( ( { label, parameter, max } ) => (
					<RangeControl
						key={ parameter }
						label={ label }
						value={ envelope[ parameter ] ?? DEFAULT_ENVELOPE[ parameter ] }
						min={ 0.05 }
						max={ max }
						step={ 0.05 }
						// @ts-ignore: `withInputField` prop is not exist at @types
						withInputField={ false }
						onChange={ ( value ) => onEnvelopeChange( parameter, value ) }
					/>
				) ) }
			</div>
			<canvas ref={ ref } className="piano-block-synthesizer-setting__graph" />
			<Button
				className="piano-block-synthesizer-setting__reset"
				isDestructive
				isSmall
				onClick={ onEnvelopeReset }
			>
				{ __( 'Reset envelope', 'piano-block' ) }
			</Button>
		</VStack>
	);
};

export default SynthesizerSetting;

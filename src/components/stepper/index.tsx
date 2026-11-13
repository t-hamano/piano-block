/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useId } from '@wordpress/element';

type Props = {
	label: string;
	value: number;
	min: number;
	max: number;
	onChange: ( value: number ) => void;
};

const Stepper = ( { label, value, min, max, onChange }: Props ) => {
	const id = useId();
	const isMin = value <= min;
	const isMax = value >= max;
	const displayValue = `${ min < 0 && value > 0 ? '+' : '' }${ value }`;

	return (
		<div className="piano-block-stepper" role="group" aria-labelledby={ id }>
			<span id={ id } className="piano-block-stepper__label">
				{ label }
			</span>
			<div className="piano-block-stepper__control">
				<button
					type="button"
					className="piano-block-stepper__button"
					aria-label={ sprintf(
						/* translators: %s: Control label, e.g. Octave. */
						__( 'Decrease %s', 'piano-block' ),
						label
					) }
					// Keep the button focusable at the limit.
					aria-disabled={ isMin }
					onClick={ () => ! isMin && onChange( value - 1 ) }
				>
					−
				</button>
				<output className="piano-block-stepper__value">{ displayValue }</output>
				<button
					type="button"
					className="piano-block-stepper__button"
					aria-label={ sprintf(
						/* translators: %s: Control label, e.g. Octave. */
						__( 'Increase %s', 'piano-block' ),
						label
					) }
					aria-disabled={ isMax }
					onClick={ () => ! isMax && onChange( value + 1 ) }
				>
					+
				</button>
			</div>
		</div>
	);
};

export default Stepper;

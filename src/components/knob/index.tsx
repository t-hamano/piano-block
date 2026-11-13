/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useId, useRef, useState } from '@wordpress/element';

type Props = {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: ( value: number ) => void;
};

const ROTATION_RANGE = 270;
const DRAG_DISTANCE = 150;

const getPrecision = ( step: number ) => ( step.toString().split( '.' )[ 1 ] ?? '' ).length;

const Knob = ( { label, value, min, max, step, onChange }: Props ) => {
	const id = useId();
	const inputRef = useRef< HTMLInputElement >( null );
	const dragRef = useRef< { startY: number; startValue: number } | null >( null );
	const [ isDragging, setIsDragging ] = useState( false );
	const [ isValueHidden, setIsValueHidden ] = useState( false );
	const [ isPointerFocused, setIsPointerFocused ] = useState( false );

	const precision = getPrecision( step );
	const angle = ( ( value - min ) / ( max - min ) - 0.5 ) * ROTATION_RANGE;
	const displayValue = `${ min < 0 && value > 0 ? '+' : '' }${ value.toFixed( precision ) }`;

	const onPointerDown = ( event: React.PointerEvent< HTMLDivElement > ) => {
		if ( event.button !== 0 ) {
			return;
		}
		// Keep the native range input from jumping to the pointer position.
		event.preventDefault();
		inputRef.current?.focus();
		event.currentTarget.setPointerCapture( event.pointerId );
		dragRef.current = { startY: event.clientY, startValue: value };
		setIsDragging( true );
		setIsValueHidden( false );
		setIsPointerFocused( true );
	};

	const onPointerMove = ( event: React.PointerEvent< HTMLDivElement > ) => {
		if ( ! dragRef.current ) {
			return;
		}
		const { startY, startValue } = dragRef.current;
		const delta = ( ( startY - event.clientY ) / DRAG_DISTANCE ) * ( max - min );
		const steppedValue = Math.round( ( startValue + delta ) / step ) * step;
		const newValue = Number( Math.min( Math.max( steppedValue, min ), max ).toFixed( precision ) );
		if ( newValue !== value ) {
			onChange( newValue );
		}
	};

	const onPointerUp = () => {
		dragRef.current = null;
		setIsDragging( false );
	};

	const onKeyDown = ( event: React.KeyboardEvent< HTMLInputElement > ) => {
		setIsPointerFocused( false );
		if ( event.key === 'Escape' && ! isValueHidden ) {
			event.stopPropagation();
			setIsValueHidden( true );
		}
	};

	return (
		<div
			className={ clsx( 'piano-block-knob', {
				'is-turning': isDragging,
				'is-value-hidden': isValueHidden,
				'is-pointer-focused': isPointerFocused,
			} ) }
			onPointerEnter={ () => setIsValueHidden( false ) }
		>
			<label className="piano-block-knob__label" htmlFor={ id }>
				{ label }
			</label>
			<div
				className="piano-block-knob__control"
				onPointerDown={ onPointerDown }
				onPointerMove={ onPointerMove }
				onPointerUp={ onPointerUp }
				onPointerCancel={ onPointerUp }
			>
				<input
					ref={ inputRef }
					id={ id }
					className="piano-block-knob__input"
					type="range"
					min={ min }
					max={ max }
					step={ step }
					value={ value }
					onChange={ ( event ) => {
						setIsValueHidden( false );
						onChange( Number( event.target.value ) );
					} }
					onFocus={ () => setIsValueHidden( false ) }
					onBlur={ () => setIsPointerFocused( false ) }
					onKeyDown={ onKeyDown }
				/>
				<span className="piano-block-knob__dial" aria-hidden="true">
					<span
						className="piano-block-knob__indicator"
						style={ { transform: `rotate(${ angle }deg)` } }
					/>
				</span>
			</div>
			<span className="piano-block-knob__value" aria-hidden="true">
				{ displayValue }
			</span>
		</div>
	);
};

export default Knob;

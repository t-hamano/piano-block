/**
 * WordPress dependencies
 */
import { useId } from '@wordpress/element';

type Props = {
	label: string;
	value: string;
	options: readonly { label: string; value: string }[];
	onChange: ( value: string ) => void;
};

const Select = ( { label, value, options, onChange }: Props ) => {
	const id = useId();

	return (
		<div className="piano-block-select">
			<label className="piano-block-select__label" htmlFor={ id }>
				{ label }
			</label>
			<div className="piano-block-select__control">
				<select
					id={ id }
					className="piano-block-select__input"
					value={ value }
					onChange={ ( event ) => onChange( event.target.value ) }
				>
					{ options.map( ( option ) => (
						<option key={ option.value } value={ option.value }>
							{ option.label }
						</option>
					) ) }
				</select>
			</div>
		</div>
	);
};

export default Select;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { KEYBOARD_LAYOUTS } from '../../keyboard-layout';
import type { Key } from '../../constants';

type Props = {
	activeKeys: Key[];
	keyLayout: string;
	keyIndicator: string;
	onKeyClick: ( note: string, octave: number ) => void;
};

const Keyboard = ( { activeKeys, keyLayout, keyIndicator, onKeyClick }: Props ) => {
	const keys =
		KEYBOARD_LAYOUTS.find( ( { value } ) => value === keyLayout )?.keys ||
		KEYBOARD_LAYOUTS[ 0 ].keys;

	// Trigger the note when the key is clicked by the mouse cursor or when the enter key is pressed.
	const onClick = ( note: string, octave: number ) => {
		onKeyClick( note, octave );
	};

	return (
		<div className="piano-block-keyboard">
			<div className="piano-block-keyboard__inner">
				{ keys.map( ( key, index ) => {
					return (
						<button
							key={ index }
							tabIndex={ -1 }
							className={ classnames( 'piano-block-keyboard__key', {
								'piano-block-keyboard__key--white': ! key.isBlackKey,
								'piano-block-keyboard__key--black': key.isBlackKey,
								'is-pressed': activeKeys.some(
									( { note, octave } ) => key.note === note && key.octave === octave
								),
							} ) }
							aria-label={ sprintf(
								/* translators: %s is replaced with the key name. */
								__( 'Note: %s', 'piano-block' ),
								key.note + key.octave
							) }
							type="button"
							onClick={ () => onClick( key.note, key.octave ) }
						>
							{ keyIndicator === 'key' && key.name.join( ' ' ) }
							{ keyIndicator === 'spn' && `${ key.note }${ key.octave }` }
						</button>
					);
				} ) }
			</div>
		</div>
	);
};

export default Keyboard;

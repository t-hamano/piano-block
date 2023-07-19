/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	// @ts-ignore: has no exported member
	useResizeObserver,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { KEYBOARD_WIDTH, KEYBOARD_PADDING } from '../../constants';
import { KEYBOARD_LAYOUTS } from '../../keyboard-layout';
import type { Key } from '../../constants';

type Props = {
	activeKeys: Key[];
	keyLayout: string;
	onKeyClick: ( note: string, octave: number ) => void;
};

const Keyboard = ( { activeKeys, keyLayout, onKeyClick }: Props ) => {
	// Hooks to control the display of horizontal scroll bars.
	const [ resizeListener, keysInnerSizes ] = useResizeObserver();

	const keys =
		KEYBOARD_LAYOUTS.find( ( { value } ) => value === keyLayout )?.keys ||
		KEYBOARD_LAYOUTS[ 0 ].keys;

	// Trigger the note when the key is clicked by the mouse cursor or when the enter key is pressed.
	const onClick = ( note: string, octave: number ) => {
		onKeyClick( note, octave );
	};

	return (
		<div
			className={ classnames( 'piano-block-keyboard', {
				'is-scroll':
					keysInnerSizes?.width && keysInnerSizes.width < KEYBOARD_WIDTH + KEYBOARD_PADDING * 2,
			} ) }
		>
			{ resizeListener }
			<div
				className="piano-block-keyboard__inner"
				style={ { width: `${ KEYBOARD_WIDTH }px`, padding: `0 ${ KEYBOARD_PADDING }px` } }
			>
				{ keys.map( ( key, index ) => (
					<button
						key={ index }
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
						{ key.name.join( ' ' ) }
					</button>
				) ) }
			</div>
		</div>
	);
};

export default Keyboard;

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/icons';

type Props = React.ComponentPropsWithoutRef< 'button' > & {
	icon: React.ReactElement;
	label: string;
};

const IconButton = ( { icon, label, disabled, onClick, ...props }: Props ) => {
	return (
		<button
			type="button"
			className="piano-block-icon-button"
			aria-label={ label }
			aria-disabled={ disabled || undefined }
			onClick={ disabled ? undefined : onClick }
			{ ...props }
		>
			<Icon icon={ icon } size={ 20 } />
		</button>
	);
};

export default IconButton;

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/icons';

type Props = React.ComponentPropsWithoutRef< 'button' > & {
	icon: React.ReactElement;
	label: string;
};

const IconButton = ( { icon, label, ...props }: Props ) => {
	return (
		<button type="button" className="piano-block-icon-button" aria-label={ label } { ...props }>
			<Icon icon={ icon } size={ 20 } />
		</button>
	);
};

export default IconButton;

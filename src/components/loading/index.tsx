/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import Spinner from '../spinner';

const Loading = () => {
	return (
		<Stack
			className="piano-block-loading"
			direction="column"
			gap="sm"
			align="center"
			justify="center"
		>
			<Spinner />
			{ __( 'Loading…', 'piano-block' ) }
		</Stack>
	);
};

export default Loading;

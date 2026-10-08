/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

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

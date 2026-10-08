/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner, Stack } from '@wordpress/ui';

const Loading = () => {
	return (
		<Stack
			className="piano-block-loading"
			direction="column"
			gap="sm"
			align="center"
			justify="center"
		>
			<Spinner color="currentColor" />
			{ __( 'Loading…', 'piano-block' ) }
		</Stack>
	);
};

export default Loading;

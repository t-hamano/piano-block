/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	// Use `ToggleControl` to match the controls on the front end.
	// eslint-disable-next-line @wordpress/use-recommended-components
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Piano from './components/piano';
import type { BlockAttributes } from './constants';

export default function Edit( { attributes, setAttributes }: BlockEditProps< BlockAttributes > ) {
	const blockProps = useBlockProps();

	const dropdownMenuProps = ! useViewportMatch( 'medium', '<' )
		? {
				popoverProps: {
					placement: 'left-start' as const,
					offset: 259,
				},
			}
		: undefined;

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'piano-block' ) }
					resetAll={ () => {
						setAttributes( { showOnFront: false } );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Display on the front end', 'piano-block' ) }
						isShownByDefault
						hasValue={ () => attributes.showOnFront }
						onDeselect={ () => setAttributes( { showOnFront: false } ) }
					>
						<ToggleControl
							label={ __( 'Display on the front end', 'piano-block' ) }
							checked={ attributes.showOnFront }
							onChange={ ( value ) => setAttributes( { showOnFront: value } ) }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...blockProps }>
				<Piano settings={ attributes } onChange={ setAttributes } />
			</div>
		</>
	);
}

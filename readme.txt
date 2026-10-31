=== Piano Block ===
Contributors: wildworks
Tags: gutenberg, audio, music, piano
Donate link: https://www.paypal.me/thamanoJP
Requires at least: 7.1
Tested up to: 7.1
Stable tag: 2.10.0
Requires PHP: 8.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Play a variety of tones using the piano keyboard.

== Description ==

Piano Block is a plugin that allows you to play a variety of tones using the piano keyboard.
This plugin does not add any useful features to WordPress, nor does it add any useful blocks to help you write posts.
If you get stuck writing an article or just want a little distraction, insert this block and enjoy some music.

- 15 instruments
- Realistic sounds sampled from real instruments
- Adjustable volume, octave shift, and sustain pedal
- Synthesizer with 18 oscillator types and a customizable envelope

Note: The keys are optimized for QWERTY keyboards and may not map correctly on other keyboards.

== Installation ==

1. Upload the `piano-block` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= How is this block displayed on the front end? =

By default, nothing is output on the front end. If you turn on "Display on the front end" in the block settings sidebar, the piano also appears on the front end and visitors to your site can play it. However, multiple pianos cannot be displayed on the same page.

= Can I record what I play? =

Recording is not supported in the current version due to technical and licensing issues.
I may add it in a future update if those issues are resolved.

== Screenshots ==

1. Piano Block
2. Piano Block Synthesizer Settings

== Resources and Audio Samples ==

= Tone.js (Web Audio framework) =
License: MIT License
Source: https://github.com/Tonejs/Tone.js/

= Splendid Grand Piano (Acoustic Piano) =
License: Public Domain
Source: https://github.com/sfzinstruments/SplendidGrandPiano

= Greg Sullivan's E-Pianos (Electric Piano 1, 2) =
License: CC-BY-3.0
Source: https://github.com/sfzinstruments/GregSullivan.E-Pianos

= tonewheel organ sound samples by hammondman (Organ) =
License: CC0-1.0
Source: https://freesound.org/people/hammondman/packs/18844/

= Shinyguitar by Karoryfer Samples (Electric Guitar, Acoustic Guitar) =
License: CC-BY-4.0
Source: https://github.com/sfzinstruments/karoryfer.shinyguitar

= Pastabass by Karoryfer Samples (Electric Bass) =
License: CC-BY-4.0
Source: https://github.com/sfzinstruments/karoryfer.pastabass

= Meatbass by Karoryfer Samples (Acoustic Bass) =
License: CC-BY-4.0
Source: https://github.com/sfzinstruments/karoryfer.meatbass

= Bear Sax by Karoryfer Samples (Sax) =
License: CC-BY-4.0
Source: https://github.com/sfzinstruments/karoryfer.bear-sax

= VS Chamber Orchestra (Flute, Harp, Muted Trumpet, Violin, Xylophone) =
License: CC0-1.0
Source: https://github.com/sgossner/VSCO-2-CE

= SVG Repo (Block Icon) =
License: CC0
Source: https://www.svgrepo.com/svg/47923/piano-keys-part

= Free SVG (Block Background Image) =
License: Public Domain
Source: https://freesvg.org/wg-3

= Google Fonts (Banner Font) =
License: Apache License 2.0
Source: https://fonts.google.com/specimen/Yellowtail

== Changelog ==

= 2.10.0 =
* Tested up to WordPress 7.1
* Fix: Stale icon data in block.json
* Drop support for WordPress 6.9

= 2.9.1 =
* Security: Properly escape the synthesizer setting attribute
* Fix: Apply the keyboard indicator setting on the front end

= 2.9.0 =
* Tested up to WordPress 7.0
* Enhancement: Polish the block sidebar
* Drop support for WordPress 6.8

= 2.8.0 =
* Tested up to WordPress 6.9
* Enhancement: Add border support
* Enhancement: Use 32px-sized controls in the control section
* Enhancement: Add ARIA roles to toggle buttons
* Enhancement: Add label to piano container and improve focus style
* Enhancement: Polish the synthesizer settings modal
* Enhancement: Polish modal style
* Enhancement: Change the order of options in the Octave dropdown
* Drop support for WordPress 6.6 and 6.7
* Drop support for PHP 7

= 2.7.0 =
* Tested up to WordPress 6.8
* Enhancement: Polish the style of the control section
* Accessibility: Respect user preference for CSS transitions
* Fix: Block is not rendered on the front end in certain configurations
* Drop support for WordPress 6.5

= 2.6.0 =
* Tested up to WordPress 6.7
* Enhancement: Improve playing responsiveness
* Enhancement: Update API version from 2 to 3
* Enhancement: Improve block icon appearance
* Enhancement: Polish the style of the control section
* Drop support for WordPress 6.4

= 2.5.0 =
* Tested up to WordPress 6.6
* Drop support for WordPress 6.3

= 2.4.0 =
* Tested up to WordPress 6.5
* Enhancement: Improve compatibility with theme styles on the front end
* Enhancement: Improve layout consistency
* Enhancement: Apply a custom scrollbar
* Enhancement: Reduce the size of the keyboard
* Fix: Typo
* Drop support for WordPress 6.2

= 2.3.0 =
* Tested up to WordPress 6.4
* Add: Keyboard indicator setting
* Drop support for WordPress 6.1

= 2.2.0 =
* Tested up to WordPress 6.3
* Add: Keyboard layout setting
* Enhancement: Allow multiple blocks to be inserted
* Enhancement: Improve keyboard and focus events
* Enhancement: Improve compatibility with theme styles on the front end
* Drop support for WordPress 5.9 and 6.0
* Drop support for PHP 7.3

= 2.1.0 =
* Tested up to WordPress 6.2

= 2.0.0 =
* Add: Synthesizer
* Enhancement: Accessibility improvements
* Fix: Duplicate script loading on the front end

= 1.1.1 =
* Tested up to WordPress 6.1
* Enhancement: Polish front-end styles
* Fix: Browser console error
* Fix: Apply translation on the front end

= 1.1.0 =
* Add: Rendering option on the front end
* Add: Margin block support
* Add: Background block support
* Enhancement: Polish the style of the control section
* Clean: Remove unnecessary files
* Doc: Update readme

= 1.0.2 =
* Tested up to WordPress 6.0
* Fix: Don't enqueue scripts on the front end
* Doc: Update author name

= 1.0.1 =
* Doc: Fix typo and spelling inconsistencies

= 1.0.0 =
* Initial release

== Upgrade Notice ==

import '../../dist/button.css';
import '../../dist/button-split.css';
import '../../dist/icon.css';
import '../../dist/menu.css';
import '../../dist/popover.css';
import '../../dist/segmented-button.css';
import * as stories from './popover.stories.js';

// TO DO: change title to "Visual" once addon-storyshots is updated https://github.com/storybookjs/storybook/pull/11267
export default {
    title: 'Visual/Popover'
};

export const Popover = () => {
    const storyNames = Object.keys(stories).filter(story => story !== 'default');
    const div = document.createElement('div');
    div.innerHTML = storyNames.map(function(item) {
        return '<div>' + stories[item]() + '</div>';
    }).join('');
    return div;
};

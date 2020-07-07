import '../../dist/button.css';
import '../../dist/icon.css';
import '../../dist/form-item.css';
import '../../dist/step-input.css';
import '../../dist/form-label.css';
import '../../dist/input.css';
import * as stories from './tabs.stories.js';

export default {
    title: 'Visual/Tabs'
};

export const Tabs = () => {
    const storyNames = Object.keys(stories).filter(story => story !== 'default');
    const div = document.createElement('div');
    div.innerHTML = storyNames.map(function(item) {
        return '<div>' + stories[item]() + '</div>';
    }).join('');
    return div;
};

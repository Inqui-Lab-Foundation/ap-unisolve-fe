import React from 'react';

import { ChartComp } from './ChartComp';
// ChartComp.stories.js|jsx

export default {
    title: 'Example/ChartComp',
    component: ChartComp,
    argTypes: {
        config :{
            title: {
                text: 'Timespent on learning'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                name: 'Installation',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
            }, {
                name: 'Other',
                data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
            }, {
                name: 'Manufacturing',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
            }, {
                name: 'Sales & Distribution',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            }, {
                name: 'Project Development',
                data: [43934, 29851, 7988, 12169, 15112, 22452, 34400, 34227]
            }],
        }
    },
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <ChartComp {...args} />;


// 👇 Each story then reuses that template (Line chart template)
export const LineChart = Template.bind({});
LineChart.args = {
    config :{
        title: {
            text: 'Timespent on learning'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: 'Project Development',
            data: [43934, 29851, 7988, 12169, 15112, 22452, 34400, 34227]
        }],
    }
};

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    block: [
        {
            type: "doc",
            id: 'intro'
        },
        {
            type: 'category',
            label: 'Блок №1: Основи Kotlin',
            items: ['block-1/ide_getting_started', 'block-1/variables', 'block-1/functions', 'block-1/operators', 'block-1/math_operations', 'block-1/scope_visibility', 'block-1/cycles', 'block-1/random_numbers', 'block-1/conclusion_1'],
        },
        {
            type: 'category',
            label: 'Блок №2: Основи ООП',
            items: ['block-2/oop_theory', 'block-2/oop_practise'],
        },
    ]

    // But you can create a sidebar manually
    /*
    tutorialSidebar: [
      {
        type: 'category',
        label: 'Tutorial',
        items: ['hello'],
      },
    ],
     */
};

module.exports = sidebars;

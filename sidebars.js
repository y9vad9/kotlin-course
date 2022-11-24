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
    kotlin: [
        {
            type: "doc",
            id: 'kotlin/intro'
        },
        {
            type: 'category',
            label: 'kotlin-basics',
            items: [
                'kotlin/basics/ide',
                'kotlin/basics/variables',
                'kotlin/basics/functions',
                'kotlin/basics/operators',
                'kotlin/basics/scope-visibility',
                'kotlin/basics/math-operations',
                'kotlin/basics/cycles-and-recursions',
                'kotlin/basics/string-templates',
                'kotlin/basics/random-numbers',
                'kotlin/basics/conclusion'
            ],
        },
        {
            type: 'category',
            label: 'kotlin-data-structures',
            items: [
                'kotlin/data-structures/intro',
                'kotlin/data-structures/objects',
                'kotlin/data-structures/classes',
                'kotlin/data-structures/strings',
                'kotlin/data-structures/abstractions',
                'kotlin/data-structures/null-safety',
                'kotlin/data-structures/errors'
            ],
        },
    ],
    gradle: [
        {
            type: "doc",
            id: 'gradle/intro'
        },
        {
            type: 'category',
            label: 'gradle-basics',
            items: [
                'gradle/basics/project',
                'gradle/basics/modules',
                'gradle/basics/source-sets',
                'gradle/basics/multimodule'
            ],
        },
    ]
};

module.exports = sidebars;

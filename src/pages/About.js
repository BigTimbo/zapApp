import React from 'react';
import '../CSS/About.css';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 */

/**
 * About page that contains content presenting a mission statement.
 * @returns {JSX.Element}
 * @constructor
 */
function About() {
    return (
        <div className="about">
            <div className="aboutContent">
                <h1>Mission Statement</h1>
                <p>To conserve Africa’s pangolin species and the habitat they occupy</p>
                <p>Pangolin – the venerable ‘wise old man’ of the African bush – is said to be a totem of good luck and the bringer of rain. This enigmatic creature that holds the secrets of 85 million years of evolution is now the most poached mammal on the planet. Find out about the unseen lives of these rare creatures and how you can join us in averting their extinction.</p>
            </div>
        </div>
    )
}
export default About;
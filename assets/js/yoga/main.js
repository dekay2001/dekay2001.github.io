import { getSequenceLinks, start_app } from './play-sequence.js';

function main(sequenceId) {
    const sequenceLinks = getSequenceLinks();
    const config = {
        secondsInterval: 5,
        displayInDivId: "yoga-sequence",
        titleDivId: "sequence-title",
        resourceUrl: `..${sequenceLinks[sequenceId]}`
    }
    start_app(config);
}

window.onload = () => {
    main("suryanamskaraa");
}
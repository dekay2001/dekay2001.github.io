import { getSequenceLinks, start_app } from './play-sequence.js';

export function main(sequenceId) {
    const sequenceLinks = getSequenceLinks();
    const config = {
        secondsInterval: 5,
        ashtangaSequencesDivId: "ashtanga-sequences",
        titleDivId: "sequence-title",
        resourceUrl: `..${sequenceLinks[sequenceId]}`
    }
    start_app(config);
}

window.onload = () => {
    main("suryanamskaraa");
}
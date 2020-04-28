import { DisplayableCollection, DisplayablePlayer } from "../base/displayables.js";


//  TODO: Inject the displayer.  
//  Add VCR controls.  Start, Stop, Forward, Back
//  Put logic/factory functions related to creating a yoga sequence player to that folder. 
//  Add a yoga link/page that uses the yoga application.
//  Add more sequences/data to yoga application. 
//  Add controls to switch sequences. 
//  Add controls to changing timing. 
export async function playSequence(secondsInterval, displayer, resourceCollection) {
    await resourceCollection.fetchAll();
    const displayableCollection = new DisplayableCollection(resourceCollection.data);
    const player = new DisplayablePlayer(displayableCollection, displayer);
    player.play(secondsInterval);
}
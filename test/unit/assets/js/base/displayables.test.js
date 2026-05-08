/**
 * @jest-environment jsdom
 */

const { TextDisplayer, DisplayablePlayer, Displayable } = require('../../../../../assets/js/base/displayables.js');

describe('Displayable', () => {
    test('should store content and extract text', () => {
        const content = { text: 'Hello World' };
        const displayable = new Displayable(content);
        expect(displayable.text).toBe('Hello World');
        expect(displayable.content).toBe(content);
    });
});

describe('TextDisplayer', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="target"></div>';
    });

    test('should display text in the target element', () => {
        const displayer = new TextDisplayer('target');
        displayer.display({ text: 'Hello' });
        expect(document.getElementById('target').innerText).toBe('Hello');
    });

    test('should overwrite previous text', () => {
        const displayer = new TextDisplayer('target');
        displayer.display({ text: 'First' });
        displayer.display({ text: 'Second' });
        expect(document.getElementById('target').innerText).toBe('Second');
    });
});

describe('DisplayablePlayer', () => {
    let mockCollection;
    let player;

    beforeEach(() => {
        jest.useFakeTimers();
        mockCollection = {
            nextDisplayable: jest.fn(),
            previousDisplayable: jest.fn()
        };
        player = new DisplayablePlayer(mockCollection);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should notify listeners on displayNext', () => {
        const item = { text: 'pose1' };
        mockCollection.nextDisplayable.mockReturnValue(item);
        const listener = { displayNext: jest.fn(), displayPrevious: jest.fn() };
        player.register(listener);

        player.displayNext(5);

        expect(listener.displayNext).toHaveBeenCalledWith(item);
    });

    test('should not notify listeners when collection is exhausted', () => {
        mockCollection.nextDisplayable.mockReturnValue(null);
        const listener = { displayNext: jest.fn(), displayPrevious: jest.fn() };
        player.register(listener);

        player.displayNext(5);

        expect(listener.displayNext).not.toHaveBeenCalled();
    });

    test('should notify listeners on displayPrevious', () => {
        const item = { text: 'pose0' };
        mockCollection.previousDisplayable.mockReturnValue(item);
        const listener = { displayNext: jest.fn(), displayPrevious: jest.fn() };
        player.register(listener);

        player.displayPrevious();

        expect(listener.displayPrevious).toHaveBeenCalledWith(item);
    });

    test('should notify multiple registered listeners', () => {
        const item = { text: 'pose1' };
        mockCollection.nextDisplayable.mockReturnValue(item);
        const listener1 = { displayNext: jest.fn(), displayPrevious: jest.fn() };
        const listener2 = { displayNext: jest.fn(), displayPrevious: jest.fn() };
        player.register(listener1);
        player.register(listener2);

        player.displayNext(5);

        expect(listener1.displayNext).toHaveBeenCalledWith(item);
        expect(listener2.displayNext).toHaveBeenCalledWith(item);
    });

    test('play should schedule displayNext after timeout', () => {
        const item = { text: 'pose1' };
        mockCollection.nextDisplayable.mockReturnValue(item);
        const listener = { displayNext: jest.fn(), displayPrevious: jest.fn() };
        player.register(listener);

        player.play(3);

        expect(listener.displayNext).not.toHaveBeenCalled();
        jest.advanceTimersByTime(3000);
        expect(listener.displayNext).toHaveBeenCalledWith(item);
    });
});
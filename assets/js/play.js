const myDataCollection = {
    items: [
        {
            id: "1",
            name: "name1"
        },
        {
            id: "2",
            name: "name2"
        }
    ]
};


class DisplayableProvider {
    constructor() {
        this.data = myDataCollection;
    }

    getDisplayables() {
        const displayables = this.data.items.forEach(item => {
            return new Displayable(item);
        });
        return displayables;
    }
}

class NameAsTextDisplayer {
    constructor(element) {
        this.element = element;
    }

    display(displayable) {
        this.element.innerText = displayable.content.name;
    }
}

class Displayable {
    constructor(content) {
        this.content = content;
    }
}


function main() {
    const elementId = "dynamicdiv";
    const displayInElement = document.getElementById(elementId);
    const displayer = new NameAsTextDisplayer(displayInElement);
    const displayableProvider = new DisplayableProvider();
    const displayables = displayableProvider.getDisplayables();
    displayables.forEach(displayable => {
        console.log(`Displaying ${displayable}`);
        displayer.display(displayable);
    });
}

main();
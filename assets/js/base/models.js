export class ResourceCollection {
    constructor(resourceUrl) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    async fetchAll() {
        const response = await fetch(this.resourceUrl);
        this.data = await response.json();
    }
}
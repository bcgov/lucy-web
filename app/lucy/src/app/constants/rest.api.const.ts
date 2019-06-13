
declare const window: any;

class RemoteEndPoints {

    private static instance: RemoteEndPoints;

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    get origin(): string {
        return window.location.origin || `http://localhost`;
    }

    get baseURL(): string {
        return `${this.origin}/api/v1`;
    }

    get usetInfo(): string {
        return this.baseURL + `/userInfo`;
    }

    get categories(): string {
        return this.baseURL + `/categories`;
    }

    get users(): string {
        return this.baseURL + `/users`;
    }

    get species(): string {
        return this.baseURL + `/species`;
    }
}

export const RemoteEndPointService = RemoteEndPoints.getInstance();

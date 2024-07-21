export default class BranchModel {
    constructor(branch, sector, numOfCom) {
        this._branch = branch;
        this._sector = sector;
        this._numOfCom = numOfCom;
    }


    get branch() {
        return this._branch;
    }

    set branch(value) {
        this._branch = value;
    }

    get sector() {
        return this._sector;
    }

    set sector(value) {
        this._sector = value;
    }

    get numOfCom() {
        return this._numOfCom;
    }

    set numOfCom(value) {
        this._numOfCom = value;
    }
}
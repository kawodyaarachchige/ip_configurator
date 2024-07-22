export default class BranchModel {
    constructor(branch, sector, numOfCom, blockSize, networkAdd, DefaultGW, BroadcastAdd, SNM) {
        this._branch = branch;
        this._sector = sector;
        this._numOfCom = numOfCom;
        this._blockSize = blockSize;
        this._networkAdd = networkAdd;
        this._DefaultGW = DefaultGW;
        this._BroadcastAdd = BroadcastAdd;
        this._SNM = SNM;

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

    get blockSize() {
        return this._blockSize;
    }

    set blockSize(value) {
        this._blockSize = value;
    }

    get networkAdd() {
        return this._networkAdd;
    }

    set networkAdd(value) {
        this._networkAdd = value;
    }

    get DefaultGW() {
        return this._DefaultGW;
    }

    set DefaultGW(value) {
        this._DefaultGW = value;
    }

    get BroadcastAdd() {
        return this._BroadcastAdd;
    }

    set BroadcastAdd(value) {
        this._BroadcastAdd = value;
    }

    get SNM() {
        return this._SNM;
    }

    set SNM(value) {
        this._SNM = value;
    }
}
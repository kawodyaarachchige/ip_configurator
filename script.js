import {branchDetails} from "./db.js";
import BranchModel from "./BranchModel.js";

$(`#btnGenerate`).on(`click`, () => {

    setNetworkType();
    selectNetworkClass(branchDetails);


})

function selectNetworkClass(data) {
    const branchEmployeeCounts = {};

    data.forEach(item => {
        if (!branchEmployeeCounts[item.branch]) {
            branchEmployeeCounts[item.branch] = 0;
        }
        branchEmployeeCounts[item.branch] += item.employeeCount;
    });

    let maxEmployees = 0;
    let maxBranch = '';

    for (const [branch, count] of Object.entries(branchEmployeeCounts)) {
        if (count > maxEmployees) {
            maxEmployees = count;
            maxBranch = branch;
        }
    }

    if (maxEmployees < 200) {
        $(`#networkClass`).text(`Class C`);
    } else if (maxEmployees < 1000) {
        $(`#networkClass`).text(`Class B`);
    }

}

function setNetworkType(){
    var count = getBranchesCount(branchDetails);
    console.log(count)

    if (count === 1) {
        $(`#networkType`).text(`LAN (Local Area Network)`);
    } else {
        $(`#networkType`).text(`MAN (Metropolitan Area Network)`);
    }
}

function getBranchesCount(branches) {
    const uniqueLocations = new Set();

    branches.forEach(brnch => {
        uniqueLocations.add(brnch.branch);
    });

    return uniqueLocations.size;
}


$(`#btnAdd`).on(`click`, () => {
    const branch = document.getElementById('branch').value;
    const sector = document.getElementById('sector').value;
    const numOfCom = document.getElementById('noOfComputers').value;

    if (branch == "" || sector == "" || numOfCom == "") {
        alert("Please fill all the fields");
    } else {
        var bSize = checkBlockSize(numOfCom);
        const snm = checkSNM(bSize);

        let branchDetail = new BranchModel(
            branch, sector, numOfCom, bSize,"","","",snm);
        branchDetails.push(branchDetail);
        console.log(branchDetails);

        clearFields()
        loadBranchTable()
    }
});

function checkSNM(data){

    let value = 256 - data;
    let newSNM = "255.255.255."+value;
    return newSNM;

}

function clearFields() {
    $('#branch').val("");
    $('#sector').val("");
    $('#noOfComputers').val("");
}

function loadBranchTable() {
    $('#tableBody').empty();

    branchDetails.map((branch,index) => {

        var record = `<tr>
        <td >${branch.branch}</td>
        <td >${branch.sector}</td>
        <td >${branch.numOfCom}</td>
        <td >${branch.blockSize}</td>
        <td >${branch.networkAdd}</td>
        <td >${branch.DefaultGW}</td>
        <td >${branch.BroadcastAdd}</td>
        <td >${branch.SNM}</td>
    </tr>`;

        console.log(record)

        $('#configTable').append(record);
    });

}

function checkBlockSize(data) {
    if (data < 2) {
        return 2;
    } else if (data < 4) {
        return 4;
    } else if (data < 8) {
        return 8;
    } else if (data < 16) {
        return 16;
    } else if (data < 32) {
        return 32;
    } else if (data < 64) {
        return 64;
    } else if (data < 128) {
        return 128;
    } else if (data < 256) {
        return 256;
    }
}


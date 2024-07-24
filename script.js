import {branchDetails} from "./db.js";
import BranchModel from "./BranchModel.js";

var branchCount = 0;
var ipAdd = '192.168.0.0';

$(`#btnGenerate`).on(`click`, () => {

    showHidden();
    setNetworkType();
    selectNetworkClass(branchDetails);
    var sortedBranches = sortBranches();
    branchDetails.length = 0;
    branchDetails.push(...sortedBranches)
    setNetworkAddress();
    sortBranchesAndAssignIPs(branchDetails, ipAdd);
    loadBranchTable(branchDetails)
})


function sortBranchesAndAssignIPs(branchDetails, startIp) {
    // Helper function to increment IP address
    function incrementIP(ip, increment) {
        const parts = ip.split('.').map(Number);
        let total = parts[3] + increment;
        parts[3] = total % 256;
        total = Math.floor(total / 256);
        parts[2] = (parts[2] + total) % 256;
        total = Math.floor((parts[2] + total) / 256);
        parts[1] = (parts[1] + total) % 256;
        total = Math.floor((parts[1] + total) / 256);
        parts[0] = (parts[0] + total) % 256;
        return parts.join('.');
    }

    // Group sectors by branch
    const branches = branchDetails.reduce((acc, entry) => {
        if (!acc[entry.branch]) {
            acc[entry.branch] = [];
        }
        acc[entry.branch].push(entry);
        return acc;
    }, {});

    // Sort sectors within each branch by the number of computers
    for (const branch in branches) {
        branches[branch].sort((a, b) => b.numOfCom - a.numOfCom);
    }

    // Combine the sorted sectors back into the original structure and assign IPs
    let currentIP = startIp;
    const sortedDetails = Object.keys(branches)
        .sort()
        .reduce((acc, branch) => {
            branches[branch].forEach((sector) => {
                sector.networkAdd = currentIP; // Assign current IP to sector
                sector.DefaultGW = incrementIP(currentIP, 1); // Increment IP based on number of computers
                currentIP = incrementIP(currentIP, sector.blockSize); // Increment IP based on number of computers
                sector.BroadcastAdd = incrementIP(currentIP, -1); // Increment IP based on number of computers
            });
            acc.push(...branches[branch]);
            return acc;
        }, []);

    // Reassign sorted details back to the original array
    branchDetails.length = 0; // Clear the original array
    branchDetails.push(...sortedDetails); // Assign sorted data back to the original array
}


function setNetworkAddress(){
    for (let i = 0; i < branchDetails.length; i++) {
        branchDetails[i].networkAdd = ipAdd;
        ipAdd = ipAdd.substring(0, ipAdd.lastIndexOf(".") + 1) + (parseInt(ipAdd.substring(ipAdd.lastIndexOf(".") + 1)) + 1);
    }
}

function sortBranches(){
    // Group sectors by branch
    const branches = branchDetails.reduce((acc, entry) => {
        if (!acc[entry.branch]) {
            acc[entry.branch] = [];
        }
        acc[entry.branch].push(entry);
        return acc;
    }, {});

    console.log(branches)

// Sort sectors within each branch by the number of computers
    for (const branch in branches) {
        branches[branch].sort((a, b) => b.numOfCom - a.numOfCom);
    }

// Count the number of branches
    branchCount = Object.keys(branches).length;

// Combine the sorted sectors back into the original structure
     var sortBranches = Object.keys(branches)
        .sort()
        .reduce((acc, branch) => {
            acc.push(...branches[branch]);
            return acc;
        }, []);

    console.log(branchDetails)
    console.log(sortBranches)

    return sortBranches;

}


function showHidden(){
    $('.hide').css("display","inherit")
}

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
        loadBranchTable(branchDetails)
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

function loadBranchTable(data) {
    $('#tableBody').empty();

    data.map((branch,index) => {

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


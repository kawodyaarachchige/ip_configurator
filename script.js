import {branchDetails} from "./db.js";
import BranchModel from "./BranchModel.js";

$(`#btnGenerate`).on(`click`, () => {

})

$(`#btnAdd`).on(`click`, () => {
    const branch = document.getElementById('branch').value;
    const sector = document.getElementById('sector').value;
    const numOfCom = document.getElementById('noOfComputers').value;

    if (branch == "" || sector == "" || numOfCom == "") {
        alert("Please fill all the fields");
    } else {
        let branchDetail = new BranchModel(branch, sector, numOfCom);
        branchDetails.push(branchDetail);
        console.log(branchDetails);

        clearFields()
        loadBranchTable()
    }
});

function clearFields() {
    $('#branch').val("");
    $('#sector').val("");
    $('#noOfComputers').val("");
}

function loadBranchTable() {
    $('#tableBody').empty();

    branchDetails.map((branch,index) => {
        var branchName = branch.branch;
        var sectorName = branch.sector;
        var numOfComputers = branch.numOfCom;

        var record = `<tr>
        <td class="cus-id-val">${branchName}</td>
        <td class="cus-fname-val">${sectorName}</td>
        <td class="cus-address-val">${numOfComputers}</td>
    </tr>`;

        console.log(record)

        $('#configTable').append(record);
    });

}


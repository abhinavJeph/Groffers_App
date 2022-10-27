let historyTable = document.getElementById("historyTable");
let mileStoneTable = document.getElementById("mileStoneTable");

let statusBtn = document.querySelector("#statusBtn");
statusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    axios.post(statusBtn.getAttribute("href"))
        .then(function (response) {
            var url = new URL("http://localhost:3000" + statusBtn.getAttribute("href"));
            var search_params = url.searchParams;
            var status = search_params.get('status');
            let newStatus = status == 'true';
            search_params.set('status', !newStatus);
            console.log(search_params.get('status'));
            url.search = search_params.toString();

            statusBtn.setAttribute("href", url.pathname + url.search)
            statusBtn.innerHTML = newStatus ? "Withdraw" : "Enroll";
        })
        .catch(function (error) {
            console.log(error);
        });
});

let referralBtn = document.querySelector("#referralBtn");
referralBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    // console.log(referralBtn);
    let referralContainer = document.querySelector("#referralCode");
    let containerDisplay = window.getComputedStyle(referralContainer).display;
    if (containerDisplay == "none") {
        axios.get(referralBtn.getAttribute("href"))
            .then(function (response) {
                console.log(response);
                // console.log(referralContainer);
                referralContainer.style = "display: inline";
                referralContainer.innerHTML = `Your Refferal Code is ${response.data.refferalCode}`;
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        referralContainer.style = "display: none";
    }
});

let historyBtn = document.getElementById("historyBtn");
historyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    mileStoneTable.style = "display: none";
    let containerDisplay = window.getComputedStyle(historyTable).display;
    if (containerDisplay == "none") {
        axios.get(historyBtn.getAttribute("href")).then((response) => {
            console.log(response);
            historyTable.style = "display: table";
            // console.log(response);

            deleteAllTableRows(historyTable);
            response.data.data.forEach(refer => {
                var row = historyTable.insertRow(- 1);
                row.classList.add("table-primary");
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = refer.createdAt;
                cell2.innerHTML = refer.name;
                cell3.innerHTML = refer.email;
                cell4.innerHTML = refer.incentive + " $";
            });
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        historyTable.style = "display: none";
    }
})

var deleteAllTableRows = (table) => {
    var tableHeaderRowCount = 1;
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

let mileStoneBtn = document.getElementById("mileStoneBtn");
mileStoneBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    historyTable.style = "display: none";
    let containerDisplay = window.getComputedStyle(mileStoneTable).display;
    if (containerDisplay == "none") {
        axios.get(mileStoneBtn.getAttribute("href")).then((response) => {
            // console.log(response);
            mileStoneTable.style = "display: table";
            console.log(response);

            deleteAllTableRows(mileStoneTable);
            let sNo = 1;
            response.data.data.forEach(milestone => {
                var row = mileStoneTable.insertRow(- 1);

                if (milestone.isComplete) row.classList.add("table-success");
                else row.classList.add("table-danger");

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = sNo++;
                cell2.innerHTML = milestone.goal;
                cell3.innerHTML = milestone.reward + "$";
            });

            let infoCard = document.getElementById("infoCard");
            const rewardInfo = document.createElement("h5");
            rewardInfo.setAttribute("id", "rewardInfo");
            rewardInfo.classList.add("card-text");
            rewardInfo.innerHTML = `You have recieved ${response.data.rewardAccuired} $ from achieving Milestones`
            infoCard.appendChild(rewardInfo);

        }).catch(function (error) {
            console.log(error);
        });
    } else {
        mileStoneTable.style = "display: none";
        document.getElementById("rewardInfo").remove();
    }
})
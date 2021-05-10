let customers = document.querySelector('table#customer > tbody');
let applierCustomers = document.querySelector('div.modal .modal-body tbody');
let close = document.querySelector('.modal-footer > button');

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if(httpRequest.readyState === 4 && httpRequest.status === 200){
            var response = JSON.parse(httpRequest.responseText);
            if(callback) callback(response);   
                response.forEach(customer => {
                    addRow(customer);
                });
            }         
        
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

fetchJSONFile('db.json', function (data) {
    // console.log(data);
});


function addRow(customer)
{
    let id = document.createElement('td');
    id.textContent = customer.id;

    let fullname = document.createElement('td');
    fullname.textContent = customer.name + " " + customer.surname;

    let image = document.createElement('td');
    var customerImg = new Image();
    customerImg.src = customer.img;
    customerImg.setAttribute("class", "banner-img");
    customerImg.setAttribute("alt", "effy");
    image.append(customerImg);

    let salary = document.createElement('td');
    salary.textContent = customer.salary.value + customer.salary.currency;

    let activeLoan = document.createElement('td');
    let i = document.createElement('i');

    let perMonth = document.createElement('td');
    let activeLoanArr = customer.loans.filter(function (val) {
        return val.closed === false;
    });

    let resultPerMonth= 0;
    if(activeLoanArr.length > 0){
        i.className = 'fas fa-check-circle';
        i.style.color = "green";
        activeLoan.append(i);
        
        activeLoanArr.forEach(loan => {
            resultPerMonth += loan.perMonth.value;
            perMonth.textContent = resultPerMonth + loan.perMonth.currency;
        });
    }
    else{
        i.className = 'fas fa-times-circle';
        i.style.color = "red"
        activeLoan.append(i);
        perMonth.textContent = "Borcu yoxdur";
    }
    
    let applyForLoan = document.createElement('td');
    let button = document.createElement('button');
    button.className = "btn btn-primary";
    button.style.color = "white";
    button.setAttribute("type", "button");
    button.textContent = "Apply";

    function IsClickable () {
        return customer.salary.value * 0.45 <= resultPerMonth;
    }
    if(IsClickable() == true){
        button.className += " disabled";
    }
    else{
        button.className += " ";
        button.setAttribute("data-toggle", "modal");
        button.setAttribute("data-target", "#myModal");
    } 
    
    // Modal
    let Id;
    let applierTr = document.createElement('tr');

    button.onclick = function () {
        applierTr.innerHTML = "";   
        applierCustomers.innerHTML = "";
        let customerFullname = document.querySelector('.modal-title');
        customerFullname.textContent = customer.name + " " + customer.surname;
        Id = customer.id;

        let applierId = document.createElement('td');
        applierId.textContent = Id;

        let applierLoaner = document.createElement('td');

        let applierLoanersArr = customer.loans.filter(function (val) {
            return val.closed === true;
        });

        if(applierLoanersArr.length > 0){
            applierLoanersArr.forEach(loan => {
                applierLoaner.textContent += loan.loaner;
            });
        }
        else{
            applierTr.textContent = "Kecmis kreditler yoxdur";
        }

        applierTr.appendChild(applierId);
        applierTr.appendChild(applierLoaner);
        applierCustomers.append(applierTr);
    }                    
    
    applyForLoan.append(button);

    let tr = document.createElement('tr');
    tr.style.cursor = "pointer";
    tr.appendChild(id);
    tr.appendChild(fullname);
    tr.appendChild(image);
    tr.appendChild(salary);
    tr.appendChild(activeLoan);
    tr.appendChild(perMonth);
    tr.appendChild(applyForLoan);

   
    customers.append(tr);
}
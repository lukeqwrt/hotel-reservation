const reservation = document.querySelector('#reservation-list');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const confirmForm = document.querySelector('#confirmForm')

const setupUi = (user) => {
    if(user){
        //account info
        const html = `
            <div>Logged in as  ${user.email}</div>
        `;
        accountDetails.innerHTML = html;

        //toggle ui elements
        loggedInLinks.forEach(item => item.style.display = "block");
        loggedOutLinks.forEach(item => item.style.display = "none");
   

    }else{
        //hide acc info 
        accountDetails.innerHTML = '';

        //toggle ui elements
        loggedInLinks.forEach(item => item.style.display = "none");
        loggedOutLinks.forEach(item => item.style.display = "block");
    }
}
const table = document.getElementById('table')
function renderReservation(doc){

    let tr = document.createElement('tr');
    tr.classList.add('mytr')
    const buttons = document.getElementById('buttons')
//₱${doc.data().totalCharges}
    var tdContent = `
        <td class="text-nowrap">
            ${doc.data().email}
        </td>
        <td class="text-nowrap text-success" style="font-weight: 600">
              ₱${doc.data().totalPrice}
        </td>
        <td class="text-nowrap">
            ${doc.data().firstname}
        </td>
        <td class="text-nowrap">
            ${doc.data().lastname}
        </td>
        <td class="text-nowrap">
            ${doc.data().contact}
        </td>
        <td class="text-nowrap">
            ${doc.data().checkin}
        </td>
        <td class="text-nowrap text-trucate" >
            ${doc.data().checkout}
        </td>
        <td class="text-nowrap">
            ${doc.data().adults}
        </td>
        <td class="text-nowrap">
            ${doc.data().children}
        </td>
        <td class="text-nowrap">
            ${doc.data().rooms}
        </td>
        <td class="text-nowrap">
            ${doc.data().CustomeRooms}
        </td>
        <td class="text-nowrap">
          ${doc.data().userId}
        </td>
        <td id="buttons" class="d-flex text-nowrap" style="position: sticky;
        right:0;
        background-color: white;
        z-index:2;">
            <button id="accept" class="btn btn-success text-white mr-2">Accept</button>
            <button id="cancel" class="btn btn-danger mr-2">Cancel</button>
            <button id="remove" class="btn btn-default mr-2">X</button>
        </td>
    `

    tr.setAttribute('data-id', doc.id);

    tr.innerHTML = tdContent;
    // console.log(tr.querySelector('#remove'))
    const removeBtn = tr.querySelector('#remove')
    const acceptBtn = tr.querySelector('#accept')
    const cancel = tr.querySelector('#cancel')
    // buttons.appendChild("x")
    table.appendChild(tr)

    // deleting data
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

    // accept and send email
    acceptBtn.addEventListener('click', (e) => {
        e.stopPropagation();
            let userEmail = e.target.parentElement.parentElement.children[0].innerText
            Email.send({
                Host: "smtp.gmail.com",
                Username: "reservationhotel76@gmail.com",
                Password: "Hotel1234",
                To: userEmail,
                From: "reservationhotel76@gmail.com",
                Subject: "Letter of confirmation for hotel booking.",
                Body: `Hello ${doc.data().firstname}, This letter is in regards to the hotel booking you have made for the following date/dates ${doc.data().checkin} to ${doc.data().checkout} at our SBIT3N HOTEL in Quezon City.

                We like to inform you that the bookings you made are confirmed. We will make full arrangements for all your staff members and visitors. 

                We are glad to let you know that the ${doc.data().rooms} rooms you asked for and the exact rooms of ${doc.data().CustomeRooms} have been taken care of and we are allotting for you.

                Regards,

                Hotel
                ` 
              }).then(function (message) {
                  alert(`Sent to ${userEmail}`)
                  console.log(message)
              });
    })

    cancel.addEventListener('click', (e) => {
    //  console.log('clicking')
        e.stopPropagation();
        let userEmail = e.target.parentElement.parentElement.children[0].innerText
        Email.send({
            Host: "smtp.gmail.com",
            Username: "reservationhotel76@gmail.com",
            Password: "Hotel1234",
            To: userEmail,
            From: "reservationhotel76@gmail.com",
            Subject: "Letter of confirmation for hotel booking.",
            Body: `
            Hello ${doc.data().firstname}, 
                We are sorry to say that your booking at our hotel was canceled due to some problems with your booking, thank you very much for understanding
            ` 
          }).then(function (message) {
              alert(`Sent to ${userEmail}`)
            //   console.log(message)
          });
    })
}
         
 
auth.onAuthStateChanged(user => {
    if(user){
               //       realtime listener
               db.collection('Reservation').onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    if(change.type == 'added'){
                        renderReservation(change.doc)
                    
                    }else if(change.type == 'removed'){
                        let li = table.querySelector('[data-id=' + change.doc.id + ']')
                
                        table.removeChild(li);
                    }
                })
            })

        setupUi(user)
    }
    else{
        setupUi()
        
    }
})

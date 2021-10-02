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

function renderCustomerDetails(doc){
    let li = document.createElement('li');
    let email = document.createElement('div');
    let firstname = document.createElement('div');
    let lastname = document.createElement('div');
    let contact = document.createElement('div');
    let reservefrom = document.createElement('div');
    let reserveto = document.createElement('div');
    let adults = document.createElement('div');
    let children = document.createElement('div');
    let rooms = document.createElement('div');
    let customerRooms = document.createElement('div');
    let userid = document.createElement('div');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    email.textContent = `Email: ${doc.data().email}`;
    firstname.textContent = `Firstname: ${doc.data().firstname}`;
    lastname.textContent = `Lastname: ${doc.data().lastname}`;
    contact.textContent = `Contact: ${doc.data().contact}`;
    reservefrom.textContent = `reservefrom: ${doc.data().checkin}`;
    reserveto.textContent = `reserveto: ${doc.data().checkout}`;
    adults.textContent = `adults: ${doc.data().adults}`;
    children.textContent = `children: ${doc.data().children}`;
    rooms.textContent = `rooms: ${doc.data().rooms}`;
    customerRooms.textContent = `customerRooms: ${doc.data().CustomeRooms}`;
    userid.textContent = `userid: ${doc.data().userId}`;
    cross.textContent = 'X';
    cross.classList.add('cross')


    li.appendChild(email)
    li.appendChild(firstname)
    li.appendChild(lastname)
    li.appendChild(contact)
    li.appendChild(reservefrom)
    li.appendChild(reserveto)
    li.appendChild(adults)
    li.appendChild(children)
    li.appendChild(rooms)
    li.appendChild(customerRooms)
    li.appendChild(userid)
    li.appendChild(cross)

    reservation.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}



auth.onAuthStateChanged(user => {
    if(user){
         //       realtime listener
         db.collection('Reservation').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    renderCustomerDetails(change.doc)
                
                }else if(change.type == 'removed'){
                    let li = reservation.querySelector('[data-id=' + change.doc.id + ']')
                    reservation.removeChild(li);
                }
            })
        })
        setupUi(user)
    }
    else{
        setupUi()
    }
})

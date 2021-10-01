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
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    email.textContent = `Email: ${doc.data().email}`;
    firstname.textContent = `Firstname: ${doc.data().firstname}`;
    lastname.textContent = `Lastname: ${doc.data().lastname}`;
    contact.textContent = `Contact: ${doc.data().contact}`;
    cross.textContent = 'X';

    li.classList.add('list-group-item')
    li.classList.add('list-three')
    li.appendChild(email)
    li.appendChild(firstname)
    li.appendChild(lastname)
    li.appendChild(contact)
    li.appendChild(cross)

    reservation.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}
function renderReservation(doc){
    let li = document.createElement('li');
    let checkin = document.createElement('div');
    let checkout = document.createElement('div');
    let rooms = document.createElement('div');
    let adult = document.createElement('div');
    let children = document.createElement('div');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    checkin.textContent = `Checkin: ${doc.data().checkin}`;
    checkout.textContent = `Checkout: ${doc.data().checkout}`;
    rooms.textContent = `Rooms: ${doc.data().rooms}`;
    adult.textContent = `Adult: ${doc.data().adults}`;
    children.textContent = `Children: ${doc.data().children}`;
    cross.textContent = 'X';

    li.classList.add('list-group-item')
    li.classList.add('list-one')
    li.appendChild(checkin)
    li.appendChild(checkout)
    li.appendChild(rooms)
    li.appendChild(adult)
    li.appendChild(children)
    li.appendChild(cross)

    reservation.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}

function renderCustomerRoom(doc){
    let li = document.createElement('li');
    let CustomerRooms = document.createElement('div');
    let price = document.createElement('div');
    let cross = document.createElement('div');
    li.setAttribute('data-id', doc.id);
    CustomerRooms.textContent = `Your Room: ${doc.data().CustomerRooms}`;
    price.textContent = `Rooms Price: ${doc.data().price}`;
    cross.textContent = 'X';

    li.classList.add('list-group-item')
    li.classList.add('list-two')

    li.appendChild(CustomerRooms);
    li.appendChild(price);
    li.appendChild(cross);

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
         db.collection('Reservation').where("customerConfirm", "==", "confirmDB").onSnapshot(snapshot => {
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
         db.collection('Reservation').where("uniqueResDocs", "==", "show").onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    renderReservation(change.doc)
                
                }else if(change.type == 'removed'){
                    let li = reservation.querySelector('[data-id=' + change.doc.id + ']')
                    reservation.removeChild(li);
                }
            })
        })
        db.collection('Reservation').where("customerRoomDB", "==", "customerRoomDB").onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    renderCustomerRoom(change.doc)
                
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
